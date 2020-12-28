import * as core from "@actions/core";
import * as fs from "fs";
import { Saxophone } from "saxophone-ts";
import {
  CDATANode,
  TagCloseNode,
  TagOpenNode,
  TextNode,
} from "saxophone-ts/dist/types/src/static/nodes";

export default abstract class ReportParser<T> {
  private readonly context: string[] = ["root"];
  private readonly parser = new Saxophone()
    .on("tagOpen", (tag) => this.handleTagOpen(tag))
    .on("tagClose", (tag) => this.handleTagClose(tag))
    .on("text", (tag) => this.handleText(tag))
    .on("cdata", (tag) => this.handleText(tag));

  protected constructor(protected readonly report: T, private readonly reportPath: string) {}

  read() {
    try {
      const xml = fs.readFileSync(this.reportPath, { encoding: "utf-8" });
      this.parser.parse(xml);
      return this.report;
    } catch (error) {
      core.warning(`Failed to read report: ${this.reportPath}`);
      return undefined;
    }
  }

  protected getContext() {
    return this.context[0];
  }

  private handleTagOpen(tag: TagOpenNode) {
    this.onTagOpen(tag);
    if (tag.isSelfClosing) {
      this.onTagClose(tag);
    } else {
      this.context.unshift(tag.name);
    }
  }

  private handleTagClose(tag: TagCloseNode) {
    this.context.shift();
    this.onTagClose(tag);
  }

  private handleText(tag: TextNode | CDATANode) {
    this.onText(tag);
  }

  protected abstract onTagOpen(tag: TagOpenNode): void;
  protected abstract onTagClose(tag: TagCloseNode): void;
  protected abstract onText(tag: TextNode | CDATANode): void;
}
