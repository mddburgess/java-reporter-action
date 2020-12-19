import ReportReader from '../common/reader';
import CheckstyleReport, {CheckstyleSeverity} from './report';
import {CDATANode, TagCloseNode, TagOpenNode, TextNode} from 'saxophone-ts/dist/types/src/static/nodes';
import {parseAttrs} from 'saxophone-ts';
import {XmlEntities} from 'html-entities';

class CheckstyleReportReader extends ReportReader<CheckstyleReport> {

    private filePath = '';

    protected onTagOpen(tag: TagOpenNode): void {
        switch (tag.name) {
            case 'checkstyle':
                this.onCheckstyleOpen();
                break;
            case 'file':
                this.onFileOpen(parseAttrs(tag.attrs) as FileAttrs);
                break;
            case 'error':
                this.onErrorOpen(parseAttrs(tag.attrs) as ErrorAttrs);
                break;
        }
    }

    private onCheckstyleOpen() {
        this.report = {
            violations: []
        };
    }

    private onFileOpen(attrs: FileAttrs) {
        this.filePath = XmlEntities.decode(attrs.name);
    }

    private onErrorOpen(attrs: ErrorAttrs) {
        this.report && this.report.violations.push({
            filePath: this.filePath,
            line: Number(attrs.line),
            column: Number(attrs.column) || 0,
            rule: XmlEntities.decode(attrs.source),
            severity: attrs.severity,
            message: XmlEntities.decode(attrs.message)
        });
    }

    protected onTagClose(tag: TagCloseNode): void {
        // do nothing
    }

    protected onText(tag: TextNode | CDATANode): void {
        // do nothing
    }
}

interface FileAttrs {
    name: string;
}

interface ErrorAttrs {
    line: string;
    column?: string;
    severity: CheckstyleSeverity,
    message: string;
    source: string;
}

export default CheckstyleReportReader;
