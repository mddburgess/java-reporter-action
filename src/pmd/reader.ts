import ReportReader from '../common/reader';
import PmdReport, {PmdViolation} from './report';
import {CDATANode, TagCloseNode, TagOpenNode, TextNode} from 'saxophone-ts/dist/types/src/static/nodes';
import {parseAttrs} from 'saxophone-ts';

class PmdReportReader extends ReportReader<PmdReport> {

    private filePath = '';
    private violation?: PmdViolation;

    protected onTagOpen(tag: TagOpenNode): void {
        switch (tag.name) {
            case 'pmd':
                this.onPmdOpen();
                break;
            case 'file':
                this.onFileOpen(parseAttrs(tag.attrs) as FileAttrs);
                break;
            case 'violation':
                this.onViolationOpen(parseAttrs(tag.attrs) as ViolationAttrs);
                break;
        }
    }

    private onPmdOpen() {
        this.report = {
            violations: []
        }
    }

    private onFileOpen(attrs: FileAttrs) {
        this.filePath = attrs.name;
    }

    private onViolationOpen(attrs: ViolationAttrs) {
        this.violation = {
            filePath: this.filePath,
            startLine: Number(attrs.beginline),
            endLine: Number(attrs.endline),
            startColumn: Number(attrs.begincolumn),
            endColumn: Number(attrs.endcolumn),
            ruleset: attrs.ruleset,
            rule: attrs.rule,
            priority: attrs.priority,
            message: '',
        }
    }

    protected onTagClose(tag: TagCloseNode): void {
        if (tag.name !== 'violation' || !this.report || !this.violation) {
            return;
        }

        this.violation.message = this.violation.message.trim();
        if (!this.violation.message.endsWith('.')) {
            this.violation.message += '.';
        }
        this.report.violations.push(this.violation);
        this.violation = undefined;
    }

    protected onText(tag: TextNode | CDATANode): void {
        this.violation && (this.violation.message += tag.contents);
    }
}

interface FileAttrs {
    name: string;
}

interface ViolationAttrs {
    beginline: string;
    endline: string;
    begincolumn: string;
    endcolumn: string;
    rule: string;
    ruleset: string;
    priority: string;
}

export default PmdReportReader;
