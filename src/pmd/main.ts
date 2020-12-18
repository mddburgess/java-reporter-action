import * as core from '@actions/core';
import {findFiles} from '../common/files';
import fs from 'fs';
import {PmdReport} from './report';
import {PmdParser} from './parser';
import * as github from '@actions/github';
import {Context} from '@actions/github/lib/context';
import {toAnnotation} from './annotator';

export async function checkPmd() {
    const reportPaths = await findPmdReports(['**/pmd.xml']);
    const surefireReport = await parsePmdReports(reportPaths);
    core.info(JSON.stringify(surefireReport, undefined, 2));

    const token = core.getInput('github-token', {required: true});
    const octokit = github.getOctokit(token);

    const githubResponse = await octokit.checks.create({
        ...github.context.repo,
        name: 'pmd',
        head_sha: resolveHeadSha(github.context),
        status: 'completed',
        conclusion: resolveConclusion(surefireReport),
        output: {
            title: resolveTitle(surefireReport),
            summary: resolveSummary(surefireReport),
            annotations: resolveAnnotations(surefireReport)
        }
    });

    core.debug(JSON.stringify(githubResponse, undefined, 2));
}

export async function findPmdReports(searchPaths: string[]) {
    core.startGroup('Searching for PMD reports');
    core.info('search-paths:');
    searchPaths.forEach(searchPath => core.info(`  ${searchPath}`));
    core.endGroup();

    const reportPaths = await findFiles(searchPaths);

    core.startGroup(`Found ${reportPaths.length} PMD reports`);
    reportPaths.forEach(reportPath => core.info(reportPath));
    core.endGroup();

    return reportPaths;
}

async function parsePmdReports(reportPaths: string[]) {
    const reports: PmdReport = {
        violations: []
    }
    for (const reportPath of reportPaths) {
        const xml = await fs.promises.readFile(reportPath, {encoding: 'utf-8'})
        const report = new PmdParser().parse(xml);
        if (report) {
            reports.violations.push(...report.violations);
        } else {
            core.warning(`Cannot read PMD report: ${reportPath}`);
        }
    }
    return reports;
}

function resolveHeadSha(context: Context): string {
    return context.payload.pull_request
        ? context.payload.pull_request.head.sha
        : context.sha;
}

function resolveConclusion(report: PmdReport) {
    if (report.violations.length > 0) {
        return 'failure';
    }
    return 'success';
}

function resolveTitle(report: PmdReport) {
    return report.violations.length
        ? `${report.violations.length} violations`
        : 'No violations';
}

function resolveSummary(report: PmdReport) {
    return resolveTitle(report);
}

function resolveAnnotations(report: PmdReport) {
    return report.violations.slice(0, 50).map(violation => toAnnotation(violation));
}
