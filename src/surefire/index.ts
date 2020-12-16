import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import {findFiles} from '../common/files';
import {SurefireParser} from './parser';
import {SurefireReport} from './report';
import {toAnnotation} from './annotator';

export async function checkSurefire() {
    const reportPaths = await findSurefireReports(['**/surefire-reports/TEST-*.xml']);
    const surefireReport = await parseSurefireReports(reportPaths);
    core.info(JSON.stringify(surefireReport, undefined, 2));

    const token = core.getInput('github-token', {required: true});
    const octokit = github.getOctokit(token);

    const githubResponse = octokit.checks.create({
        ...github.context.repo,
        name: 'surefire',
        head_sha: github.context.sha,
        status: 'completed',
        conclusion: resolveConclusion(surefireReport),
        output: {
            title: resolveTitle(surefireReport),
            summary: resolveSummary(surefireReport),
            annotations: await resolveAnnotations(surefireReport)
        }
    });

    core.debug(JSON.stringify(githubResponse, undefined, 2));
}

export async function findSurefireReports(searchPaths: string[]) {
    core.startGroup('Searching for Surefire reports');
    core.info('search-paths:');
    searchPaths.forEach(searchPath => core.info(`  ${searchPath}`));
    core.endGroup();

    const reportPaths = await findFiles(searchPaths);

    core.startGroup(`Found ${reportPaths.length} Surefire reports`);
    reportPaths.forEach(reportPath => core.info(reportPath));
    core.endGroup();

    return reportPaths;
}

async function parseSurefireReports(reportPaths: string[]) {
    const reports: SurefireReport = {
        tests: 0,
        failures: 0,
        errors: 0,
        skipped: 0,
        testCases: []
    }
    for (const reportPath of reportPaths) {
        const xml = await fs.promises.readFile(reportPath, {encoding: 'utf-8'})
        const report = new SurefireParser().parse(xml);
        if (report) {
            reports.tests += report.tests;
            reports.failures += report.failures;
            reports.errors += report.failures;
            reports.skipped += report.skipped;
            reports.testCases.push(...report.testCases);
        } else {
            core.warning(`Cannot read Surefire report: ${reportPath}`);
        }
    }
    return reports;
}

function resolveConclusion(report: SurefireReport) {
    if (report.failures + report.errors > 0) {
        return 'failure';
    }
    return 'success';
}

function resolveTitle(report: SurefireReport) {
    const failuresAndErrors = report.failures + report.errors;
    const skippedMessage = report.skipped ? ` (${report.skipped} skipped)` : '';

    if (failuresAndErrors) {
        return `${failuresAndErrors} tests failed` + skippedMessage;
    } else {
        return `${report.tests - report.skipped} tests passed` + skippedMessage;
    }
}

function resolveSummary(report: SurefireReport) {
    const passed = report.tests - report.failures - report.errors - report.skipped;
    return `| Tests Run | ${report.tests} |
| :--- | ---: |
| Passed | ${passed} |
| Failures | ${report.failures} |
| Errors | ${report.errors} |
| Skipped | ${report.skipped} |`;
}

async function resolveAnnotations(report: SurefireReport) {
    const annotations = [];
    for (const testCase of report.testCases) {
        annotations.push(await toAnnotation(testCase));
    }
    return annotations;
}
