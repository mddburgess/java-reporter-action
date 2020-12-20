import Check from '../common/check';
import {Annotation} from '../common/github';
import SpotbugsAnnotator from './annotator';
import SpotbugsReport from './report';
import SpotbugsReportReader from './reader';

class SpotbugsCheck extends Check<SpotbugsReport> {

    constructor() {
        super('spotbugs');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/spotbugsXml.xml'];
    }

    protected readReport(reportPath: string): SpotbugsReport | undefined {
        return new SpotbugsReportReader().readReport(reportPath);
    }

    protected aggregateReport(aggregate: SpotbugsReport, report: SpotbugsReport): void {
        report.categories.forEach((value, key) => aggregate.categories.set(key, value));
    }

    protected createAnnotations(aggregate: SpotbugsReport): Promise<Annotation[]> {
        return new SpotbugsAnnotator().annotate(aggregate);
    }

    protected resolveTitle(aggregate: SpotbugsReport): string {
        return aggregate.bugs.length
            ? `${aggregate.bugs.length} bugs found`
            : `No bugs found`;
    }

    protected resolveSummary(aggregate: SpotbugsReport): string {
        return this.resolveTitle(aggregate);
    }
}

export default SpotbugsCheck;
