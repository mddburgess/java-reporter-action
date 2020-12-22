import { mocked } from "ts-jest/utils";
import Github from "../index";
import CheckRun from "../check-run";

jest.mock("../index");
const GithubMock = mocked(Github);

GithubMock.prototype.createCheck = jest.fn(() => Promise.resolve(1));

describe("CheckRun.queue", () => {
  it("calls createCheck and updateCheck", async () => {
    const checkRun = new CheckRun("name");
    await checkRun.queue();
    await checkRun.queue();

    expect(GithubMock).toBeCalledTimes(1);
    const githubInstance = GithubMock.mock.instances[0];

    expect(githubInstance.createCheck).toBeCalledTimes(1);
    expect(githubInstance.createCheck).toBeCalledWith({
      name: "name",
      status: "queued",
    });

    expect(githubInstance.updateCheck).toBeCalledTimes(1);
    expect(githubInstance.updateCheck).toBeCalledWith({
      check_run_id: 1,
      status: "queued",
    });
  });
});

describe("CheckRun.begin", () => {
  it("calls createCheck and updateCheck", async () => {
    const checkRun = new CheckRun("name");
    await checkRun.begin();
    await checkRun.begin();

    expect(GithubMock).toBeCalledTimes(1);
    const githubInstance = GithubMock.mock.instances[0];

    expect(githubInstance.createCheck).toBeCalledTimes(1);
    expect(githubInstance.createCheck).toBeCalledWith({
      name: "name",
      status: "in_progress",
    });

    expect(githubInstance.updateCheck).toBeCalledTimes(1);
    expect(githubInstance.updateCheck).toBeCalledWith({
      check_run_id: 1,
      status: "in_progress",
    });
  });
});

describe("CheckRun.conclude", () => {
  it("calls createCheck and updateCheck", async () => {
    const checkRun = new CheckRun("name");
    await checkRun.conclude(undefined);
    await checkRun.conclude(undefined);

    expect(GithubMock).toBeCalledTimes(1);
    const githubInstance = GithubMock.mock.instances[0];

    expect(githubInstance.createCheck).toBeCalledTimes(1);
    expect(githubInstance.createCheck).toBeCalledWith({
      name: "name",
      status: "completed",
      conclusion: "neutral",
      output: {
        title: "name",
        summary: "name",
        text: undefined
      }
    });

    expect(githubInstance.updateCheck).toBeCalledTimes(1);
    expect(githubInstance.updateCheck).toBeCalledWith({
      check_run_id: 1,
      status: "completed",
      conclusion: "neutral",
      output: {
        title: "name",
        summary: "name",
        text: undefined
      }
    });
  });
});
