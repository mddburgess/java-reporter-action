import SurefireReport, {SurefireTestCase} from './report';
import {Annotation, AnnotationLevel} from '../common/github';
import {findRelativePath} from '../common/files';

class SurefireAnnotator {

    public async annotate(report: SurefireReport): Promise<Annotation[]> {
        return Promise.all(report.testCases.map(testCase => this.annotateTestCase(testCase)));
    }

    private async annotateTestCase(testCase: SurefireTestCase): Promise<Annotation> {
        const line = this.resolveLine(testCase);
        return {
            path: await this.resolvePath(testCase.className),
            start_line: line,
            end_line: line,
            annotation_level: this.resolveAnnotationLevel(testCase),
            title: this.resolveTitle(testCase),
            message: this.resolveMessage(testCase),
            raw_details: this.resolveRawDetails(testCase)
        };
    }

    private resolvePath(className: string) {
        const searchPath = '**/' + className.split('.').join('/') + '.java';
        return findRelativePath(searchPath);
    }

    private resolveLine(testCase: SurefireTestCase): number {
        if (testCase.stackTrace) {
            const stackTrace = testCase.stackTrace;
            const stackFrames = stackTrace.match(RegExp(`${testCase.className}.*:\\d+`));
            if (stackFrames) {
                const [stackFrame] = stackFrames.slice(-1);
                const [, line] = stackFrame.split(':');
                return Number(line);
            }
        }
        return 0;
    }

    private resolveAnnotationLevel(testCase: SurefireTestCase): AnnotationLevel {
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

    private resolveTitle(testCase: SurefireTestCase): string {
        const [simpleClassName] = testCase.className.split('.').slice(-1);
        return `Test ${testCase.result}: ${simpleClassName}.${testCase.testName}`;
    }

    private resolveMessage(testCase: SurefireTestCase): string {
        return testCase.message || testCase.stackTrace || `Test ${testCase.result}`;
    }

    private resolveRawDetails(testCase: SurefireTestCase): string | undefined {
        return testCase.stackTrace;
    }
}

export default SurefireAnnotator;
