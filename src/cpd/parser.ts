import { decode } from "html-entities";
import { parseAttrs } from "saxophone-ts";
import { TagOpenNode } from "saxophone-ts/dist/types/src/static/nodes";
import ReportParser from "../common/parser";
import CpdReport, { CpdDuplication } from "./types";

export default class CpdParser extends ReportParser<CpdReport> {
  private duplication: CpdDuplication = {
    lines: 0,
    tokens: 0,
    files: [],
  };

  public constructor(reportPath: string) {
    super(
      {
        duplications: [],
      },
      reportPath
    );
  }

  protected onTagOpen(tag: TagOpenNode): void {
    switch (tag.name) {
      case "duplication":
        this.onDuplicationOpen(parseAttrs(tag.attrs) as DuplicationAttrs);
        break;
      case "file":
        this.onFileOpen(parseAttrs(tag.attrs) as FileAttrs);
        break;
      default:
        break;
    }
  }

  private onDuplicationOpen(attrs: DuplicationAttrs) {
    this.duplication = {
      lines: Number(attrs.lines),
      tokens: Number(attrs.tokens),
      files: [],
    };
    this.report.duplications.push(this.duplication);
  }

  private onFileOpen(attrs: FileAttrs) {
    this.duplication.files.push({
      path: decode(attrs.path, { level: "xml" }),
      startLine: Number(attrs.line),
      endLine: Number(attrs.endline),
      startColumn: Number(attrs.column),
      endColumn: Number(attrs.endcolumn),
    });
  }

  protected onTagClose(): void {
    // do nothing
  }

  protected onText(): void {
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
