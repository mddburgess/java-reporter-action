import * as core from "@actions/core";
import * as github from "@actions/github";
import { CreateCheckRequest, UpdateCheckRequest } from "./types";

export default class Github {
  private readonly token;
  private readonly octokit;

  constructor() {
    this.token = core.getInput("github-token", { required: true });
    this.octokit = github.getOctokit(this.token);
  }

  async createCheck(request: CreateCheckRequest): Promise<number> {
    const githubRequest = {
      ...github.context.repo,
      head_sha: Github.resolveHeadSha(),
      ...request,
    };
    if (core.isDebug()) {
      core.debug("Create check request: " + JSON.stringify(githubRequest, undefined, 2));
    }
    const githubResponse = await this.octokit.checks.create(githubRequest);
    if (core.isDebug()) {
      core.debug("Create check response: " + JSON.stringify(githubResponse, undefined, 2));
    }
    return githubResponse.data.id;
  }

  async updateCheck(request: UpdateCheckRequest): Promise<void> {
    const githubRequest = {
      ...github.context.repo,
      ...request,
    };
    if (core.isDebug()) {
      core.debug("Update check request: " + JSON.stringify(githubRequest, undefined, 2));
    }
    const githubResponse = await this.octokit.checks.update(githubRequest);
    if (core.isDebug()) {
      core.debug("Update check response: " + JSON.stringify(githubResponse, undefined, 2));
    }
  }

  private static resolveHeadSha(): string {
    return github.context.payload.pull_request?.head.sha ?? github.context.sha;
  }
}
