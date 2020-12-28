import { XmlEntities } from "html-entities";
import { parseAttrs } from "saxophone-ts";
import {
  CDATANode,
  TagCloseNode,
  TagOpenNode,
  TextNode,
} from "saxophone-ts/dist/types/src/static/nodes";
import ReportParser from "../common/parser";
import CheckstyleReport, { CheckstyleSeverity } from "./types";

export default class CheckstyleParser extends ReportParser<CheckstyleReport> {
  private filePath = "";

  protected onTagOpen(tag: TagOpenNode): void {
    switch (tag.name) {
      case "file":
        this.onFileOpen(parseAttrs(tag.attrs) as FileAttrs);
        break;
      case "error":
        this.onErrorOpen(parseAttrs(tag.attrs) as ErrorAttrs);
        break;
    }
  }

  constructor() {
    super({
      violations: [],
    });
  }

  private onFileOpen(attrs: FileAttrs) {
    this.filePath = XmlEntities.decode(attrs.name);
  }

  private onErrorOpen(attrs: ErrorAttrs) {
    this.report.violations.push({
      filePath: this.filePath,
      line: Number(attrs.line),
      column: Number(attrs.column) || 0,
      rule: XmlEntities.decode(attrs.source),
      severity: attrs.severity,
      message: XmlEntities.decode(attrs.message),
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
  severity: CheckstyleSeverity;
  message: string;
  source: string;
}
