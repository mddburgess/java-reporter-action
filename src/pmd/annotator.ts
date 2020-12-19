import path from 'path';
import PmdReport, {PmdViolation} from './report';
import {Annotation, AnnotationLevel} from '../common/github';

class PmdAnnotator {

    public annotate(report: PmdReport): Annotation[] {
        return report.violations.map(violation => this.annotateViolation(violation));
    }

    private annotateViolation(violation: PmdViolation): Annotation {
        return {
            path: this.resolvePath(violation.filePath),
            start_line: violation.startLine,
            end_line: violation.endLine,
            start_column: violation.startLine === violation.endLine ? violation.startColumn : undefined,
            end_column: violation.startLine === violation.endLine ? violation.endColumn : undefined,
            annotation_level: this.resolveAnnotationLevel(violation),
            title: this.resolveTitle(violation),
            message: violation.message
        }
    }

    private resolvePath(filePath: string): string {
        return process.env.GITHUB_WORKSPACE
            ? path.relative(process.env.GITHUB_WORKSPACE, filePath)
            : filePath;
    }

    private resolveAnnotationLevel(violation: PmdViolation): AnnotationLevel {
        return Number(violation.priority) <= 2 ? 'failure' : 'warning';
    }

    private resolveTitle(violation: PmdViolation): string {
        return `${violation.ruleset}: ${violation.rule}`;
    }
}

export default PmdAnnotator;
