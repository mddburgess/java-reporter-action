import { XmlEntities } from "html-entities";
import { parseAttrs } from "saxophone-ts";
import {
  CDATANode,
  TagCloseNode,
  TagOpenNode,
  TextNode,
} from "saxophone-ts/dist/types/src/static/nodes";
import ReportParser from "../common/parser";
import CpdReport, { CpdDuplication } from "./types";

export default class CpdParser extends ReportParser<CpdReport> {
  private duplication: CpdDuplication = {
    lines: 0,
    tokens: 0,
    files: [],
  };

  constructor() {
    super({
      duplications: [],
    });
  }

  protected onTagOpen(tag: TagOpenNode): void {
    switch (tag.name) {
      case "duplication":
        this.onDuplicationOpen(parseAttrs(tag.attrs) as DuplicationAttrs);
        break;
      case "file":
        this.onFileOpen(parseAttrs(tag.attrs) as FileAttrs);
        break;
    }
  }

  private onDuplicationOpen(attrs: DuplicationAttrs) {
    this.duplication = {
      lines: Number(attrs.lines),
      tokens: Number(attrs.tokens),
      files: [],
    };
    this.report && this.report.duplications.push(this.duplication);
  }

  private onFileOpen(attrs: FileAttrs) {
    this.duplication.files.push({
      path: XmlEntities.decode(attrs.path),
      startLine: Number(attrs.line),
      endLine: Number(attrs.endline),
      startColumn: Number(attrs.column),
      endColumn: Number(attrs.endcolumn),
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
  lines: string;
  tokens: string;
}

interface FileAttrs {
  path: string;
  line: string;
  endline: string;
  column: string;
  endcolumn: string;
}
