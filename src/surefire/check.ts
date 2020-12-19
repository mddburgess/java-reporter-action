import Check from '../common/check';
import SurefireReport from './report';
import SurefireReportReader from './reader';
import {Annotation} from '../common/github';
import SurefireAnnotator from './annotator';

class SurefireCheck extends Check<SurefireReport> {

    constructor() {
        super('surefire');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/surefire-reports/TEST-*.xml'];
    }

    protected readReport(reportPath: string): SurefireReport | undefined {
        return new SurefireReportReader().readReport(reportPath);
    }

    protected aggregateReport(aggregate: SurefireReport, report: SurefireReport): void {
        aggregate.tests += report.tests;
        aggregate.failures += report.failures;
        aggregate.errors += report.errors;
        aggregate.skipped += report.skipped;
        aggregate.testCases.push(...report.testCases);
    }

    protected createAnnotations(aggregate: SurefireReport): Promise<Annotation[]> {
        return new SurefireAnnotator().annotate(aggregate);
    }

    protected resolveTitle(aggregate: SurefireReport): string {
        if (aggregate.failures + aggregate.errors > 0) {
            return `${aggregate.failures + aggregate.errors} tests failed`;
        } else {
            return `${aggregate.tests - aggregate.skipped} tests passed`;
        }
    }

    protected resolveSummary(aggregate: SurefireReport): string {
        const passed = aggregate.tests - aggregate.failures - aggregate.errors - aggregate.skipped;
        return [
            `|Tests run|${aggregate.tests}|`,
            `|:-|-:|`,
            `|:green_square: Passed|${passed}|`,
            `|:orange_square: Failures|${aggregate.failures}|`,
            `|:red_square: Errors|${aggregate.errors}|`,
            `|:black_large_square: Skipped|${aggregate.skipped}|`
        ].join('\n');
    }
}

export default SurefireCheck;
