import * as core from '@actions/core';
import * as github from '@actions/github';
import * as glob from '@actions/glob';
import path from 'path';
import {Annotation} from './github';

abstract class Check<T> {

    private static readonly workspacePath = process.env.GITHUB_WORKSPACE || '';

    private readonly reportType: string;
    private readonly checkCondition: CheckCondition;
    private readonly searchPaths: string[];
    private checkRunId?: number;

    protected constructor(reportType: string) {
        this.reportType = reportType;
        this.checkCondition = this.resolveCheckCondition();
        this.searchPaths = this.resolveSearchPaths();
    }

    private resolveCheckCondition() {
        const condition = core.getInput(this.reportType);
        switch (condition) {
            case 'required':
            case 'expected':
            case 'disabled':
                return CheckCondition[condition];
            case '':
                return CheckCondition.autodetect;
            default:
                core.warning(`Input '${this.reportType}' has invalid value: must be one of ['required','expected','disabled']. Defaulting to 'expected'.`);
                return CheckCondition.expected;
        }
    }

    protected abstract resolveSearchPaths(): string[];

    public async run() {
        if (this.checkCondition === CheckCondition.disabled) {
            core.warning(`${this.reportType} check is disabled.`);
            return;
        }

        const reportPaths = await this.findReports();

        if (this.checkCondition === CheckCondition.autodetect && reportPaths.length === 0) {
            core.info(`No ${this.reportType} reports found. Skipping check.`);
            return;
        }

        const aggregateReport = this.aggregateReports(reportPaths);
        core.startGroup(`Aggregate ${this.reportType} report:`);
        core.info(JSON.stringify(aggregateReport, undefined, 2));
        core.endGroup();

        if (aggregateReport === undefined) {
            core.warning(`Failed to read ${this.reportType} reports. Skipping check.`);
            return;
        }

        const annotations = (await this.createAnnotations(aggregateReport))
            .sort((a, b) => a.path.localeCompare(b.path) || a.start_line - b.start_line || a.end_line - b.end_line);
        core.startGroup(`Annotations:`);
        core.info(JSON.stringify(annotations, undefined, 2));
        core.endGroup();


        const token = core.getInput('github-token', {required: true});
        const octokit = github.getOctokit(token);
        const response = await octokit.checks.create({
            ...github.context.repo,
            name: this.reportType,
            head_sha: github.context.payload.pull_request
                ? github.context.payload.pull_request.head.sha
                : github.context.sha,
            status: 'completed',
            conclusion: this.resolveConclusion(annotations),
            output: {
                title: this.resolveTitle(aggregateReport),
                summary: this.resolveSummary(aggregateReport),
                annotations: annotations.slice(0, 50)
            }
        });
        this.checkRunId = response.data.id;

        core.info(`${this.reportType} check finished.`);
    }

    private async findReports() {
        core.startGroup(`Searching for ${this.reportType} reports...`);

        this.searchPaths.forEach(searchPath => core.info(searchPath));
        core.endGroup();

        const globber = await glob.create(this.searchPaths.join('\n'));
        const reportPaths = await globber.glob();

        core.startGroup(`Found ${reportPaths.length} ${this.reportType} reports.`);
        reportPaths.forEach(reportPath => core.info(path.relative(Check.workspacePath, reportPath)));
        core.endGroup();

        return reportPaths;
    }

    private aggregateReports(reportPaths: string[]): T | undefined {
        let aggregate = undefined;
        for (const reportPath of reportPaths) {
            const report = this.readReport(reportPath);
            if (aggregate === undefined) {
                aggregate = report;
            } else if (report !== undefined) {
                this.aggregateReport(aggregate, report);
            }
        }
        return aggregate;
    }

    protected abstract readReport(reportPath: string): T | undefined;

    protected abstract aggregateReport(aggregate: T, report: T): void;

    protected abstract createAnnotations(aggregate: T): Promise<Annotation[]>;

    private resolveConclusion(annotations: Annotation[]) {
        if (annotations.filter(a => a.annotation_level === 'failure').length > 0) {
            return 'failure';
        }
        if (annotations.filter(a => a.annotation_level === 'warning').length > 0) {
            return 'neutral';
        }
        return 'success';
    }

    protected abstract resolveTitle(aggregate: T): string;

    protected abstract resolveSummary(aggregate: T): string;
}

enum CheckCondition {
    disabled,
    autodetect,
    expected,
    required
}

export default Check;
