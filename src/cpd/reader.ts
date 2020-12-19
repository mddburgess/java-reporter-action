import ReportReader from '../common/reader';
import CpdReport, {CpdDuplication} from './report';
import {CDATANode, TagCloseNode, TagOpenNode, TextNode} from 'saxophone-ts/dist/types/src/static/nodes';
import {parseAttrs} from 'saxophone-ts';
import {XmlEntities} from 'html-entities';

class CpdReportReader extends ReportReader<CpdReport> {

    private duplication: CpdDuplication = {
        lines: 0,
        tokens: 0,
        files: []
    };

    protected onTagOpen(tag: TagOpenNode): void {
        switch (tag.name) {
            case 'pmd-cpd':
                this.onPmdCpdOpen();
                break;
            case 'duplication':
                this.onDuplicationOpen(parseAttrs(tag.attrs) as DuplicationAttrs);
                break;
            case 'file':
                this.onFileOpen(parseAttrs(tag.attrs) as FileAttrs);
                break;
        }
    }

    private onPmdCpdOpen() {
        this.report = {
            duplications: []
        };
    }

    private onDuplicationOpen(attrs: DuplicationAttrs) {
        this.duplication = {
            lines: Number(attrs.lines),
            tokens: Number(attrs.tokens),
            files: []
        }
        this.report && this.report.duplications.push(this.duplication);
    }

    private onFileOpen(attrs: FileAttrs) {
        this.duplication.files.push({
            path: XmlEntities.decode(attrs.path),
            startLine: Number(attrs.line),
            endLine: Number(attrs.endline),
            startColumn: Number(attrs.column),
            endColumn: Number(attrs.endcolumn)
        });
    }

    protected onTagClose(tag: TagCloseNode): void {
        // do nothing
    }

    protected onText(tag: TextNode | CDATANode): void {
        // do nothing
    }
}

interface DuplicationAttrs {
    lines: string,
    tokens: string
}

interface FileAttrs {
    path: string,
    line: string,
    endline: string,
    column: string,
    endcolumn: string
}

export default CpdReportReader;
