import Check from '../common/check';

class CpdCheck extends Check<string> {

    constructor() {
        super('cpd');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/cpd.xml'];
    }

    protected aggregateReport(aggregate: string, report: string): void {
    }

    protected readReport(reportPath: string): string | undefined {
        return undefined;
    }
}

export default CpdCheck;
