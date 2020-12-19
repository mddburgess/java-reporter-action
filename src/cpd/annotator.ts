import CpdReport, {CpdDuplication, CpdFile} from './report';
import {Annotation} from '../common/github';
import path from 'path';

class CpdAnnotator {

    public annotate(report: CpdReport): Annotation[] {
        return report.duplications
            .map(duplication => this.annotateDuplication(duplication))
            .reduce((a, b) => a.concat(b));
    }

    private annotateDuplication(duplication: CpdDuplication): Annotation[] {
        duplication.files.forEach(file => file.path = this.resolvePath(file.path));
        return duplication.files.map(file => this.annotateFile(duplication, file));
    }

    private resolvePath(filePath: string): string {
        return process.env.GITHUB_WORKSPACE
            ? path.relative(process.env.GITHUB_WORKSPACE, filePath)
            : filePath;
    }

    private annotateFile(duplication: CpdDuplication, file: CpdFile): Annotation {
        return {
            path: file.path,
            start_line: file.startLine,
            end_line: file.endLine,
            annotation_level: 'warning',
            title: this.resolveTitle(duplication.lines),
            message: this.resolveMessage(duplication, file.path)
        }
    }

    private resolveTitle(lines: number): string {
        return `${lines} duplicated lines`;
    }

    private resolveMessage(duplication: CpdDuplication, path: string): string {
        return [
            `Found ${duplication.lines} lines duplicated at:`,
            ...duplication.files
                .filter(file => file.path !== path)
                .map(file => `\t${file.path} line ${file.startLine}`)
        ].join('\n');
    }
}

export default CpdAnnotator;
