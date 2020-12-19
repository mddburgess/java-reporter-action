import ReportReader from '../common/reader';
import SurefireReport, {SurefireTestCase, SurefireTestResult} from './report';
import {CDATANode, TagCloseNode, TagOpenNode, TextNode} from 'saxophone-ts/dist/types/src/static/nodes';
import {parseAttrs} from 'saxophone-ts';
import {XmlEntities} from 'html-entities';

class SurefireReportReader extends ReportReader<SurefireReport> {

    private testCase: SurefireTestCase = {
        className: '',
        testName: '',
        result: 'success'
    }

    protected onTagOpen(tag: TagOpenNode): void {
        switch (tag.name) {
            case 'testsuite':
                this.onTestSuiteOpen(parseAttrs(tag.attrs) as TestSuiteAttrs);
                break;
            case 'testcase':
                this.onTestCaseOpen(parseAttrs(tag.attrs) as TestCaseAttrs);
                break;
            case 'failure':
            case 'error':
            case 'skipped':
                this.onTestResultOpen(tag.name, parseAttrs(tag.attrs) as TestResultAttrs);
                break;
        }
    }

    private onTestSuiteOpen(attrs: TestSuiteAttrs) {
        this.report = {
            tests: Number(attrs.tests),
            failures: Number(attrs.failures),
            errors: Number(attrs.errors),
            skipped: Number(attrs.skipped),
            testCases: []
        }
    }

    private onTestCaseOpen(attrs: TestCaseAttrs) {
        this.testCase.className = XmlEntities.decode(attrs.classname);
        this.testCase.testName = XmlEntities.decode(attrs.name);
    }

    private onTestResultOpen(result: SurefireTestResult, attrs: TestResultAttrs) {
        this.testCase.result = result;
        this.testCase.message = XmlEntities.decode(attrs.message);
    }

    protected onTagClose(tag: TagCloseNode): void {
        if (tag.name !== 'testcase' || this.testCase.result === 'success') {
            return;
        }

        this.testCase.stackTrace = this.testCase.stackTrace?.trim();
        this.report && this.report.testCases.push(this.testCase);
        this.testCase = {
            className: '',
            testName: '',
            result: 'success'
        }
    }

    protected onText(tag: TextNode | CDATANode): void {
        const context = this.getContext();
        if (context === 'failure' || context === 'error' || context === 'skipped') {
            this.testCase.stackTrace = (this.testCase.stackTrace || '').concat(XmlEntities.decode(tag.contents));
        }
    }
}

interface TestSuiteAttrs {
    tests: string,
    failures: string,
    errors: string,
    skipped: string
}

interface TestCaseAttrs {
    classname: string,
    name: string
}

interface TestResultAttrs {
    message: string
}

export default SurefireReportReader;
