import Check from '../common/check';
import {Annotation} from '../common/github';
import CpdReport from './report';
import CpdReportReader from './reader';
import CpdAnnotator from './annotator';

class CpdCheck extends Check<CpdReport> {

    constructor() {
        super('cpd');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/cpd.xml'];
    }

    protected readReport(reportPath: string): CpdReport | undefined {
        return new CpdReportReader().readReport(reportPath);
    }

    protected aggregateReport(aggregate: CpdReport, report: CpdReport): void {
        aggregate.duplications.push(...report.duplications);
    }

    protected createAnnotations(aggregate: CpdReport): Promise<Annotation[]> {
        const annotations = new CpdAnnotator().annotate(aggregate);
        return Promise.resolve(annotations);
    }

    protected resolveTitle(aggregate: CpdReport): string {
        return aggregate.duplications.length
            ? `${aggregate.duplications.length} duplications`
            : `No duplications`;
    }

    protected resolveSummary(aggregate: CpdReport): string {
        return this.resolveTitle(aggregate);
    }
}

export default CpdCheck;
