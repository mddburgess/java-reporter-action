import {Annotation, AnnotationLevel} from '../common/github';
import SpotbugsReport, {SpotbugsBug} from './report';
import {findRelativePath} from '../common/files';

class SpotbugsAnnotator {

    private filePaths = new Map<string, string>();

    public async annotate(report: SpotbugsReport): Promise<Annotation[]> {
        const annotations = [];
        for (const bug of report.bugs) {
            annotations.push(await this.annotateViolation(bug, report.categories));
        }
        return annotations;
    }

    private async annotateViolation(bug: SpotbugsBug, categories: Map<string, string>): Promise<Annotation> {
        return {
            path: this.filePaths.get(bug.filePath) || await this.resolvePath(bug.filePath),
            start_line: bug.startLine,
            end_line: bug.endLine,
            annotation_level: this.resolveAnnotationLevel(bug),
            title: this.resolveTitle(bug, categories),
            message: bug.longMessage
        }
    }

    private async resolvePath(filePath: string) {
        const searchPath = `**/${filePath}`;
        const foundFilePath = await findRelativePath(searchPath);
        this.filePaths.set(filePath, foundFilePath);
        return foundFilePath;
    }

    private resolveAnnotationLevel(bug: SpotbugsBug): AnnotationLevel {
        switch (bug.priority) {
            case 1:
                return 'failure';
            case 2:
                return 'warning';
            default:
                return 'notice';
        }
    }

    private resolveTitle(bug: SpotbugsBug, categories: Map<string, string>): string {
        const category = categories.get(bug.category) || bug.category;
        return `${category}: ${bug.shortMessage}`;
    }
}

export default SpotbugsAnnotator;
