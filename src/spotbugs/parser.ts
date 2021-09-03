import { decode } from "html-entities";
import { parseAttrs } from "saxophone-ts";
import {
  CDATANode,
  TagCloseNode,
  TagOpenNode,
  TextNode,
} from "saxophone-ts/dist/types/src/static/nodes";
import ReportParser from "../common/parser";
import SpotbugsReport, { SpotbugsBug } from "./types";

export default class SpotbugsParser extends ReportParser<SpotbugsReport> {
  private category = "";
  private bug: SpotbugsBug = {
    filePath: "",
    startLine: 0,
    endLine: 0,
    category: "",
    priority: 0,
    shortMessage: "",
    longMessage: "",
  };

  constructor(reportPath: string) {
    super(
      {
        categories: new Map<string, string>(),
        bugs: [],
      },
      reportPath
    );
  }

  protected onTagOpen(tag: TagOpenNode): void {
    switch (tag.name) {
      case "BugInstance":
        this.onBugInstanceOpen(parseAttrs(tag.attrs) as BugInstanceAttrs);
        break;
      case "SourceLine":
        this.onSourceLineOpen(parseAttrs(tag.attrs) as SourceLineAttrs);
        break;
      case "BugCategory":
        this.onBugCategoryOpen(parseAttrs(tag.attrs) as BugCategoryAttrs);
        break;
      default:
        break;
    }
  }

  private onBugInstanceOpen(attrs: BugInstanceAttrs) {
    this.bug = {
      filePath: "",
      startLine: 0,
      endLine: 0,
      category: decode(attrs.category, { level: "xml" }),
      priority: Number(attrs.priority),
      shortMessage: "",
      longMessage: "",
    };
    this.report.bugs.push(this.bug);
  }

  private onSourceLineOpen(attrs: SourceLineAttrs) {
    this.bug.filePath = decode(attrs.sourcepath, { level: "xml" });
    this.bug.startLine = Number(attrs.start) || this.bug.startLine;
    this.bug.endLine = Number(attrs.end) || this.bug.startLine;
  }

  private onBugCategoryOpen(attrs: BugCategoryAttrs) {
    this.category = attrs.category;
  }

  protected onTagClose(tag: TagCloseNode): void {
    if (tag.name === "BugCategory") {
      this.category = "";
    }
  }

  protected onText(tag: TextNode | CDATANode): void {
    switch (this.getContext()) {
      case "ShortMessage":
        this.bug.shortMessage = decode(tag.contents, { level: "xml" });
        break;
      case "LongMessage":
        this.bug.longMessage = decode(tag.contents, { level: "xml" });
        break;
      case "Description":
        this.category && this.report.categories.set(this.category, tag.contents);
        break;
      default:
        break;
    }
  }
}

interface BugInstanceAttrs {
  category: string;
  priority: string;
}

interface SourceLineAttrs {
  sourcepath: string;
  start: string;
  end: string;
  startBytecode: string;
  endBytecode: string;
}

interface BugCategoryAttrs {
  category: string;
}
