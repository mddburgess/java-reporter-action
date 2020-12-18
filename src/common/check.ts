import * as core from '@actions/core';
import * as glob from '@actions/glob';
import path from 'path';

abstract class Check {

    private static readonly workspacePath = process.env.GITHUB_WORKSPACE || '';

    private readonly reportType: string;

    protected constructor(reportType: string) {
        this.reportType = reportType;
    }

    public async run() {
        const reportPaths = await this.findReports();
        core.info(`${this.reportType} check finished.`);
    }

    private async findReports() {
        core.startGroup(`Searching for ${this.reportType} reports...`);

        const searchPaths = this.reportSearchPaths();
        searchPaths.forEach(searchPath => core.info(searchPath));
        core.endGroup();

        const globber = await glob.create(searchPaths.join('\n'));
        const reportPaths = await globber.glob();

        core.startGroup(`Found ${reportPaths.length} ${this.reportType} reports.`);
        reportPaths.forEach(reportPath => core.info(path.relative(Check.workspacePath, reportPath)));
        core.endGroup();

        return reportPaths;
    }

    protected abstract reportSearchPaths(): string[];
}

export default Check;
