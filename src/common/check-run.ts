import * as core from '@actions/core';
import * as github from '@actions/github';
import {Annotation} from './github';

class CheckRun {

    private readonly token;
    private readonly octokit;

    private readonly name;
    private checkRunId?: number;

    constructor(name: string) {
        this.token = core.getInput('github-token', {required: true});
        this.octokit = github.getOctokit(this.token);
        this.name = name;
    }

    public async conclude(request: CheckRunRequest) {
        if (request.output) {
            await this.createOrUpdateCheckRun({
                status: 'completed',
                conclusion: request.conclusion,
                output: {
                    title: request.output.title,
                    summary: request.output.summary
                }
            });
            await this.annotate(request.output);
        } else {
            await this.createOrUpdateCheckRun({
                status: 'completed',
                conclusion: request.conclusion
            });
        }
    }

    private async annotate(output: CheckOutput) {
        if (!output.annotations || output.annotations.length === 0) {
            return;
        }
        for (let i = 0; i < output.annotations.length; i += 50) {
            await this.updateCheckRun({
                output: {
                    title: output.title,
                    summary: output.summary,
                    annotations: output.annotations.slice(i, i + 50)
                }
            });
        }
    }

    private async createOrUpdateCheckRun(request: CheckRunRequest) {
        if (this.checkRunId === undefined) {
            await this.createCheckRun(request);
        } else {
            await this.updateCheckRun(request);
        }
    }

    private async createCheckRun(request: CheckRunRequest) {
        core.debug(`Creating ${this.name} check run...`);
        const response = await this.octokit.checks.create({
            ...github.context.repo,
            name: this.name,
            head_sha: this.resolveHeadSha(),
            ...request
        });
        this.checkRunId = response.data.id;
    }

    private async updateCheckRun(request: CheckRunRequest) {
        if (this.checkRunId === undefined) {
            throw Error('Cannot update a check run before creating it');
        }

        core.debug(`Updating ${this.name} check run...`);
        await this.octokit.checks.update({
            ...github.context.repo,
            check_run_id: this.checkRunId,
            ...request
        });
    }

    private resolveHeadSha() {
        return github.context.payload.pull_request
            ? github.context.payload.pull_request.head.sha
            : github.context.sha;
    }
}

interface CheckRunRequest {
    status?: CheckStatus,
    conclusion?: CheckConclusion,
    output?: CheckOutput
}

type CheckStatus =
    | 'queued'
    | 'in_progress'
    | 'completed';

type CheckConclusion =
    | 'success'
    | 'failure'
    | 'neutral'
    | 'cancelled'
    | 'skipped'
    | 'timed_out'
    | 'action_required';

interface CheckOutput {
    title: string,
    summary: string,
    text?: string,
    annotations?: Annotation[];
}

export default CheckRun;
