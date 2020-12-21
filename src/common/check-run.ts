import * as core from '@actions/core';
import {Annotation} from './github';
import Github from "../github";

class CheckRun {

    private readonly github;
    private readonly name;
    private checkRunId?: number;

    constructor(name: string) {
        this.github = new Github();
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
        this.checkRunId = await this.github.createCheck({
            name: this.name,
            ...request
        });
    }

    private async updateCheckRun(request: CheckRunRequest) {
        if (this.checkRunId === undefined) {
            throw Error('Cannot update a check run before creating it');
        }

        core.debug(`Updating ${this.name} check run...`);
        await this.github.updateCheck({
            check_run_id: this.checkRunId,
            ...request
        });
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
