import {Saxophone} from 'saxophone-ts';
import {CDATANode, TagCloseNode, TagOpenNode, TextNode} from 'saxophone-ts/dist/types/src/static/nodes';

export abstract class XmlParser<T> {

    private parser = new Saxophone()
        .on('tagOpen', (tag) => this.onTagOpen(tag))
        .on('tagClose', (tag) => this.onTagClose(tag))
        .on('text', (tag) => this.onText(tag))
        .on('cdata', (tag) => this.onText(tag));

    protected report?: T;

    public parse(xml: Buffer | string) {
        this.parser.parse(xml);
        return this.report;
    }

    protected abstract onTagOpen(tag: TagOpenNode): void;
    protected abstract onTagClose(tag: TagCloseNode): void;
    protected abstract onText(tag: TextNode | CDATANode): void;
}
