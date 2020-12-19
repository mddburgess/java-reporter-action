import Check from '../common/check';
import {Annotation} from '../common/github';

class SpotbugsCheck extends Check<string> {

    constructor() {
        super('spotbugs');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/spotbugsXml.xml'];
    }

    protected readReport(reportPath: string): string | undefined {
        return undefined;
    }

    protected aggregateReport(aggregate: string, report: string): void {
    }

    protected createAnnotations(aggregate: string): Promise<Annotation[]> {
        return Promise.reject();
    }

    protected resolveTitle(aggregate: string): string {
        return '';
    }

    protected resolveSummary(aggregate: string): string {
        return '';
    }
}

export default SpotbugsCheck;
