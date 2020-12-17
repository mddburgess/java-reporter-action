import {PmdViolation} from './report';
import {Annotation} from '../common/github';
import path from 'path';

export function toAnnotation(violation: PmdViolation): Annotation {
    return {
        path: resolvePath(violation.filePath),
        start_line: violation.startLine,
        end_line: violation.endLine,
        start_column: violation.startLine === violation.endLine ? violation.startColumn : undefined,
        end_column: violation.startLine === violation.endLine ? violation.endColumn : undefined,
        annotation_level: 'failure',
        title: resolveTitle(violation),
        message: violation.message
    }
}

function resolvePath(filePath: string): string {
    return process.env.GITHUB_WORKSPACE
        ? path.relative(process.env.GITHUB_WORKSPACE, filePath)
        : filePath;
}

function resolveTitle(violation: PmdViolation): string {
    return `${violation.ruleset}: ${violation.rule}`;
}
