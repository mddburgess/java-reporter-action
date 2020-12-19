import {parseAttrs} from 'saxophone-ts';
import {CDATANode, TagCloseNode, TagOpenNode, TextNode} from 'saxophone-ts/dist/types/src/static/nodes';
import SurefireReport, {SurefireTestCase} from './report';
import {XmlParser} from '../common/xml-parser';

export class SurefireParser extends XmlParser<SurefireReport> {

    private testCase?: SurefireTestCase;
    private textHandler?: (text: string) => void;

    protected onTagOpen(tag: TagOpenNode) {
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
                this.onTestResultOpen(tag.name, tag);
                break;
            default:
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
        this.testCase = {
            className: attrs.classname,
            testName: attrs.name
        }
    }

    private onTestResultOpen(result: TestResultType, tag: TagOpenNode) {
        if (this.testCase) {
            const attrs = parseAttrs(tag.attrs) as TestResultAttrs;

            this.testCase.result = result;
            this.testCase.message = attrs.message;

            if (!tag.isSelfClosing) {
                this.testCase.stackTrace = '';
                this.textHandler = (text) => {
                    this.testCase && (this.testCase.stackTrace = this.testCase.stackTrace?.concat(text));
                }
            }
        }
    }

    protected onTagClose(tag: TagCloseNode) {
        switch (tag.name) {
            case 'testcase':
                this.onTestCaseClose();
                break;
            case 'failure':
            case 'error':
            case 'skipped':
                this.onTestResultClose();
                break;
            default:
                break;
        }
    }

    private onTestCaseClose() {
        this.report && this.testCase && this.report.testCases.push(this.testCase);
        this.testCase = undefined;
    }

    private onTestResultClose() {
        this.textHandler = undefined;
    }

    protected onText(tag: TextNode | CDATANode) {
        this.textHandler && this.textHandler(tag.contents);
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

type TestResultType =
    | 'failure'
    | 'error'
    | 'skipped';
