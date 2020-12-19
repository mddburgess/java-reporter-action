import Check from '../common/check';

class SpotbugsCheck extends Check<string> {

    constructor() {
        super('spotbugs');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/spotbugsXml.xml'];
    }

    protected aggregateReport(aggregate: string, report: string): void {
    }

    protected readReport(reportPath: string): string | undefined {
        return undefined;
    }
}

export default SpotbugsCheck;
