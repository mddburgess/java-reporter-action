import { decode } from "html-entities";
import { parseAttrs } from "saxophone-ts";
import { TagOpenNode } from "saxophone-ts/dist/types/src/static/nodes";
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
      default:
        break;
    }
  }

  constructor(reportPath: string) {
    super(
      {
        violations: [],
      },
      reportPath
    );
  }

  private onFileOpen(attrs: FileAttrs) {
    this.filePath = decode(attrs.name, { level: "xml" });
  }

  private onErrorOpen(attrs: ErrorAttrs) {
    this.report.violations.push({
      filePath: this.filePath,
      line: Number(attrs.line),
      column: Number(attrs.column) || 0,
      rule: decode(attrs.source, { level: "xml" }),
      severity: attrs.severity,
      message: decode(attrs.message, { level: "xml" }),
    });
  }

  protected onTagClose(): void {
    // do nothing
  }

  protected onText(): void {
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
