import { XmlEntities } from "html-entities";
import { parseAttrs } from "saxophone-ts";
import {
  CDATANode,
  TagCloseNode,
  TagOpenNode,
  TextNode,
} from "saxophone-ts/dist/types/src/static/nodes";
import ReportParser from "../common/parser";
import PmdReport, { PmdViolation } from "./types";

export default class PmdParser extends ReportParser<PmdReport> {
  private filePath = "";
  private violation?: PmdViolation;

  constructor(reportPath: string) {
    super(
      {
        violations: [],
      },
      reportPath
    );
  }

  protected onTagOpen(tag: TagOpenNode): void {
    switch (tag.name) {
      case "file":
        this.onFileOpen(parseAttrs(tag.attrs) as FileAttrs);
        break;
      case "violation":
        this.onViolationOpen(parseAttrs(tag.attrs) as ViolationAttrs);
        break;
    }
  }

  private onFileOpen(attrs: FileAttrs) {
    this.filePath = XmlEntities.decode(attrs.name);
  }

  private onViolationOpen(attrs: ViolationAttrs) {
    this.violation = {
      filePath: this.filePath,
      startLine: Number(attrs.beginline),
      endLine: Number(attrs.endline),
      startColumn: Number(attrs.begincolumn),
      endColumn: Number(attrs.endcolumn),
      ruleset: XmlEntities.decode(attrs.ruleset),
      rule: XmlEntities.decode(attrs.rule),
      priority: XmlEntities.decode(attrs.priority),
      message: "",
    };
  }

  protected onTagClose(tag: TagCloseNode): void {
    if (tag.name !== "violation" || !this.violation) {
      return;
    }

    this.violation.message = this.violation.message.trim();
    if (!this.violation.message.endsWith(".")) {
      this.violation.message += ".";
    }
    this.report.violations.push(this.violation);
    this.violation = undefined;
  }

  protected onText(tag: TextNode | CDATANode): void {
    this.violation && (this.violation.message += XmlEntities.decode(tag.contents));
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
