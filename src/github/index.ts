import * as core from "@actions/core";
import * as github from "@actions/github";
import { CreateCheckRequest, UpdateCheckRequest } from "./types";

const token = core.getInput("github-token", { required: true });
const octokit = github.getOctokit(token);

const headSha = (): string => github.context.payload.pull_request?.head.sha ?? github.context.sha;

const createCheck = async (request: CreateCheckRequest): Promise<number> => {
  const githubRequest = {
    ...github.context.repo,
    head_sha: headSha(),
    ...request,
  };
  if (core.isDebug()) {
    core.debug("Create check request: " + JSON.stringify(githubRequest, undefined, 2));
  }
  const githubResponse = await octokit.rest.checks.create(githubRequest);
  if (core.isDebug()) {
    core.debug("Create check response: " + JSON.stringify(githubResponse, undefined, 2));
  }
  return githubResponse.data.id;
};

const updateCheck = async (request: UpdateCheckRequest): Promise<void> => {
  const githubRequest = {
    ...github.context.repo,
    ...request,
  };
  if (core.isDebug()) {
    core.debug("Update check request: " + JSON.stringify(githubRequest, undefined, 2));
  }
  const githubResponse = await octokit.rest.checks.update(githubRequest);
  if (core.isDebug()) {
    core.debug("Update check response: " + JSON.stringify(githubResponse, undefined, 2));
  }
};

export default {
  createCheck,
  updateCheck,
};
