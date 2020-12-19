import Check from '../common/check';

class CheckstyleCheck extends Check<string> {

    constructor() {
        super('checkstyle');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/checkstyle-result.xml'];
    }

    protected aggregateReport(aggregate: string, report: string): void {
    }

    protected readReport(reportPath: string): string | undefined {
        return undefined;
    }
}

export default CheckstyleCheck;
