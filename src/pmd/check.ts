import Check from '../common/check';
import {PmdReport} from './report';

class PmdCheck extends Check<PmdReport> {

    constructor() {
        super('pmd');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/pmd.xml'];
    }

    protected aggregateReport(aggregate: PmdReport, report: PmdReport): void {
    }

    protected readReport(reportPath: string): PmdReport | undefined {
        return undefined;
    }
}

export default PmdCheck;
