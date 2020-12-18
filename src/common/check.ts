import * as core from '@actions/core';
import * as github from '@actions/github';
import * as glob from '@actions/glob';
import path from 'path';
import {getInput} from '@actions/core';

abstract class Check {

    private static readonly workspacePath = process.env.GITHUB_WORKSPACE || '';

    private readonly reportType: string;
    private readonly checkCondition: CheckCondition;
    private checkRunId?: number;

    protected constructor(reportType: string) {
        this.reportType = reportType;
        this.checkCondition = this.resolveCheckCondition();
    }

    private resolveCheckCondition() {
        const condition = getInput(this.reportType);
        switch (condition) {
            case 'required':
            case 'expected':
            case 'disabled':
                return CheckCondition[condition];
            case undefined:
                return CheckCondition.autodetect;
            default:
                core.warning(`Input '${this.reportType}' is invalid - must be one of ['required','expected','disabled']. Defaulting to 'expected'.`);
                return CheckCondition.expected;
        }
    }

    public async run() {
        const reportPaths = await this.findReports();

        const token = core.getInput('github-token', {required: true});
        const octokit = github.getOctokit(token);

        if (reportPaths.length > 0 || this.checkCondition >= CheckCondition.expected) {
            const response = await octokit.checks.create({
                ...github.context.repo,
                name: this.reportType,
                head_sha: github.context.payload.pull_request
                    ? github.context.payload.pull_request.head.sha
                    : github.context.sha,
                status: 'completed',
                conclusion: reportPaths.length ? 'success' :
                    this.checkCondition === CheckCondition.required ? 'failure' : 'skipped'
            });
            this.checkRunId = response.data.id;
        }

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

enum CheckCondition {
    disabled,
    autodetect,
    expected,
    required
}

export default Check;
