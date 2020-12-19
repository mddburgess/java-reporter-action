import Check from '../common/check';
import {Annotation} from '../common/github';
import CheckstyleReportReader from './reader';
import CheckstyleReport from './report';
import CheckstyleAnnotator from './annotator';

class CheckstyleCheck extends Check<CheckstyleReport> {

    constructor() {
        super('checkstyle');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/checkstyle-result.xml'];
    }


    protected readReport(reportPath: string): CheckstyleReport | undefined {
        return new CheckstyleReportReader().readReport(reportPath);
    }

    protected aggregateReport(aggregate: CheckstyleReport, report: CheckstyleReport): void {
        aggregate.violations.push(...report.violations);
    }

    protected createAnnotations(aggregate: CheckstyleReport): Promise<Annotation[]> {
        const annotations = new CheckstyleAnnotator().annotate(aggregate);
        return Promise.resolve(annotations);
    }

    protected resolveTitle(aggregate: CheckstyleReport): string {
        return aggregate.violations.length
            ? `${aggregate.violations.length} violations`
            : `No violations`;
    }

    protected resolveSummary(aggregate: CheckstyleReport): string {
        return this.resolveTitle(aggregate);
    }
}

export default CheckstyleCheck;
