import {CDATANode, TagCloseNode, TagOpenNode, TextNode} from 'saxophone-ts/dist/types/src/static/nodes';
import {XmlParser} from '../common/xml-parser';
import {PmdReport, PmdViolation} from './report';
import {parseAttrs} from 'saxophone-ts';

export class PmdParser extends XmlParser<PmdReport> {

    private filePath: string = '';
    private violation?: PmdViolation;

    protected onTagOpen(tag: TagOpenNode) {
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
            startLine: attrs.beginline,
            endLine: attrs.endline,
            startColumn: attrs.begincolumn,
            endColumn: attrs.endcolumn,
            ruleset: attrs.ruleset,
            rule: attrs.rule,
            message: ''
        }
    }

    protected onTagClose(tag: TagCloseNode) {
        tag.name === 'violation' && this.onViolationClose();
    }

    private onViolationClose() {
        if (this.report && this.violation) {
            this.violation.message = this.violation.message.trim();
            if (!this.violation.message.endsWith('.')) {
                this.violation.message = `${this.violation.message}.`;
            }

            this.report.violations.push(this.violation);
            this.violation = undefined;
        }
    }

    protected onText(tag: TextNode | CDATANode) {
        this.violation && (this.violation.message = this.violation.message.concat(tag.contents));
    }
}

interface FileAttrs {
    name: string;
}

interface ViolationAttrs {
    beginline: number;
    endline: number;
    begincolumn: number;
    endcolumn: number;
    rule: string;
    ruleset: string;
    priority: string;
}
