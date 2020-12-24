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

  async createCheck(request: CreateCheckRequest) {
    const response = await this.octokit.checks.create({
      ...github.context.repo,
      head_sha: Github.resolveHeadSha(),
      ...request,
    });
    return response.data.id;
  }

  async updateCheck(request: UpdateCheckRequest) {
    await this.octokit.checks.update({
      ...github.context.repo,
      ...request,
    });
  }

  private static resolveHeadSha() {
    return github.context.payload.pull_request?.head.sha ?? github.context.sha;
  }
}
