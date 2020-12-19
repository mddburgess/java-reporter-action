import Check from '../common/check';
import {PmdReport} from './report';
import {Annotation} from '../common/github';

class PmdCheck extends Check<PmdReport> {

    constructor() {
        super('pmd');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/pmd.xml'];
    }

    protected readReport(reportPath: string): PmdReport | undefined {
        return undefined;
    }

    protected aggregateReport(aggregate: PmdReport, report: PmdReport): void {

    }

    protected createAnnotations(aggregate: PmdReport): Promise<Annotation[]> {
        return Promise.reject();
    }

    protected resolveTitle(aggregate: PmdReport): string {
        return '';
    }

    protected resolveSummary(aggregate: PmdReport): string {
        return '';
    }
}

export default PmdCheck;
