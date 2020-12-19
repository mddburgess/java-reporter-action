import Check from '../common/check';
import PmdReport from './report';
import {Annotation} from '../common/github';
import PmdReportReader from './reader';
import PmdAnnotator from './annotator';

class PmdCheck extends Check<PmdReport> {

    constructor() {
        super('pmd');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/pmd.xml'];
    }

    protected readReport(reportPath: string): PmdReport | undefined {
        return new PmdReportReader().readReport(reportPath);
    }

    protected aggregateReport(aggregate: PmdReport, report: PmdReport): void {
        aggregate.violations.push(...report.violations);
    }

    protected createAnnotations(aggregate: PmdReport): Promise<Annotation[]> {
        const annotations = new PmdAnnotator().annotate(aggregate);
        return Promise.resolve(annotations);
    }

    protected resolveTitle(aggregate: PmdReport): string {
        return aggregate.violations.length
            ? `${aggregate.violations.length} violations`
            : `No violations`;
    }

    protected resolveSummary(aggregate: PmdReport): string {
        return this.resolveTitle(aggregate);
    }
}

export default PmdCheck;
