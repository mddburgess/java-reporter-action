import Check from '../common/check';
import SurefireReport from './report';
import SurefireReportReader from './reader';

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
}

export default SurefireCheck;
