import {SurefireTestCase} from './report';
import {Annotation, AnnotationLevel} from '../common/github';
import {findRelativePath} from '../common/files';

export async function toAnnotation(testCase: SurefireTestCase): Promise<Annotation> {
    const path = await resolvePath(testCase.className);
    const line = resolveLine(testCase);
    const annotation_level = resolveAnnotationLevel(testCase);
    const title = resolveTitle(testCase);
    const message = resolveMessage(testCase);
    const raw_details = resolveRawDetails(testCase);

    return {
        path,
        start_line: line,
        end_line: line,
        annotation_level,
        title,
        message,
        raw_details
    }
}

export async function resolvePath(className: string): Promise<string> {
    const searchPath = '**/' + className.split('.').join('/') + '.java';
    return await findRelativePath(searchPath);
}

export function resolveLine(testCase: SurefireTestCase): number {
    if (testCase.stackTrace) {
        const className = testCase.className;
        const stackTrace = testCase.stackTrace;
        const stackFrames = stackTrace.match(RegExp(`${className}.*:\\d+`));

        if (stackFrames) {
            const [stackFrame] = stackFrames.slice(-1);
            const [, line] = stackFrame.split(':');
            return Number(line);
        }
    }
    return 0;
}

function resolveAnnotationLevel(testCase: SurefireTestCase): AnnotationLevel {
    switch (testCase.result) {
        case 'failure':
        case 'error':
            return 'failure';
        case 'skipped':
            return 'notice';
        case 'success':
        case undefined:
            throw Error('unexpected test case');
    }
}

function resolveTitle(testCase: SurefireTestCase): string {
    const [simpleClassName] = testCase.className.split('.').slice(-1);
    return simpleClassName + '.' + testCase.testName;
}

function resolveMessage(testCase: SurefireTestCase): string {
    return testCase.message || testCase.stackTrace || `Test ${testCase.result}`;
}

function resolveRawDetails(testCase: SurefireTestCase): string | undefined {
    return testCase.stackTrace;
}
