import Check from '../common/check';
import {Annotation} from '../common/github';

class CpdCheck extends Check<string> {

    constructor() {
        super('cpd');
    }

    protected resolveSearchPaths(): string[] {
        return ['**/target/cpd.xml'];
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

export default CpdCheck;
