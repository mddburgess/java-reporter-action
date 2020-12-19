import * as core from '@actions/core';
import * as fs from 'fs';
import {Saxophone} from 'saxophone-ts';
import {CDATANode, TagCloseNode, TagOpenNode, TextNode} from 'saxophone-ts/dist/types/src/static/nodes';

abstract class ReportReader<T> {

    private readonly parser = new Saxophone()
        .on('tagOpen', tag => this.handleTagOpen(tag))
        .on('tagClose', tag => this.handleTagClose(tag))
        .on('text', tag => this.handleText(tag))
        .on('cdata', tag => this.handleText(tag));
    private readonly context: string[] = ['root'];
    protected report?: T;

    public readReport(reportPath: string): T | undefined {
        try {
            const xml = fs.readFileSync(reportPath, {encoding: 'utf-8'});
            this.parser.parse(xml);
            return this.report;
        } catch (error) {
            core.warning(`Failed to read report: ${reportPath}`);
            console.log(error);
            return undefined;
        }
    }

    protected getContext(): string {
        return this.context[0];
    }

    private handleTagOpen(tag: TagOpenNode): void {
        this.onTagOpen(tag);
        if (tag.isSelfClosing) {
            this.onTagClose(tag);
        } else {
            this.context.unshift(tag.name);
        }
    }

    private handleTagClose(tag: TagCloseNode): void {
        this.context.shift();
        this.onTagClose(tag);
    }

    private handleText(tag: TextNode | CDATANode): void {
        this.onText(tag);
    }

    protected abstract onTagOpen(tag: TagOpenNode): void;
    protected abstract onTagClose(tag: TagCloseNode): void;
    protected abstract onText(tag: TextNode | CDATANode): void;
}

export default ReportReader;
