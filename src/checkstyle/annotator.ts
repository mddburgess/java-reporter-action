import CheckstyleReport, {CheckstyleViolation} from './report';
import {Annotation, AnnotationLevel} from '../common/github';
import path from 'path';

class CheckstyleAnnotator {

    public annotate(report: CheckstyleReport): Annotation[] {
        return report.violations.map(violation => this.annotateViolation(violation));
    }

    private annotateViolation(violation: CheckstyleViolation) {
        return {
            path: this.resolvePath(violation.filePath),
            start_line: violation.line,
            end_line: violation.line,
            start_column: violation.column,
            end_column: violation.column,
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

    private resolveAnnotationLevel(violation: CheckstyleViolation): AnnotationLevel {
        switch (violation.severity) {
            case 'error':
                return 'failure';
            case 'warning':
                return 'warning';
            case 'info':
                return 'notice';
        }
    }

    private resolveTitle(violation: CheckstyleViolation): string {
        return violation.rule.split('.').slice(-1)[0];
    }
}

export default CheckstyleAnnotator;
