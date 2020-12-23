import { mocked } from "ts-jest/utils";
import Github from "../index";
import CheckRun from "../check-run";
import { CheckAnnotation } from "../types";
import 'jest-extended';

jest.mock("../index");
const GithubMock = mocked(Github);

GithubMock.prototype.createCheck = jest.fn(() => Promise.resolve(1));

describe ("CheckRun", () => {
  describe("queue()", () => {
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

  describe("begin()", () => {
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

  describe("annotate()", () => {
    it("doesn't call Github with no annotations", async () => {
      const annotations: CheckAnnotation[] = [];
      const checkRun = new CheckRun("name");
      await checkRun.annotate(undefined, annotations);

      expect(GithubMock).toBeCalledTimes(1);
      const githubInstance = GithubMock.mock.instances[0];

      expect(githubInstance.createCheck).not.toBeCalled();
    });

    it("calls Github once with 50 annotations", async () => {
      const annotations: CheckAnnotation[] = new Array(50);
      const checkRun = new CheckRun("name");
      await checkRun.annotate(undefined, annotations);

      expect(GithubMock).toBeCalledTimes(1);
      const githubInstance = GithubMock.mock.instances[0];

      expect(githubInstance.createCheck).toBeCalledTimes(1);
      expect(githubInstance.createCheck).toBeCalledWith({
        name: "name",
        output: {
          title: "name",
          summary: "name",
          text: undefined,
          annotations: expect.toBeArrayOfSize(50)
        }
      });

      expect(githubInstance.updateCheck).not.toBeCalled();
    });

    it("calls Github twice with 51 annotations", async () => {
      const annotations: CheckAnnotation[] = new Array(51);
      const checkRun = new CheckRun("name");
      await checkRun.annotate(undefined, annotations);

      expect(GithubMock).toBeCalledTimes(1);
      const githubInstance = GithubMock.mock.instances[0];

      expect(githubInstance.createCheck).toBeCalledTimes(1);
      expect(githubInstance.createCheck).toBeCalledWith({
        name: "name",
        output: {
          title: "name",
          summary: "name",
          text: undefined,
          annotations: expect.toBeArrayOfSize(50)
        }
      });

      expect(githubInstance.updateCheck).toBeCalledTimes(1);
      expect(githubInstance.updateCheck).toBeCalledWith({
        check_run_id: 1,
        output: {
          title: "name",
          summary: "name",
          text: undefined,
          annotations: expect.toBeArrayOfSize(1)
        }
      });
    });
  });

  describe("conclude()", () => {
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

  describe("with custom resolvers", () => {
    it("calls custom resolvers", async () => {
      const checkRun = new CheckRun<string>("name", {
        title: (report) => `${report} title`,
        summary: (report) => `${report} summary`,
        text: (report) => `${report} text`
      });
      await checkRun.conclude("test report");

      expect(GithubMock).toBeCalledTimes(1);
      const githubInstance = GithubMock.mock.instances[0];

      expect(githubInstance.createCheck).toBeCalledTimes(1);
      expect(githubInstance.createCheck).toBeCalledWith({
        name: "name",
        status: "completed",
        conclusion: "neutral",
        output: {
          title: "test report title",
          summary: "test report summary",
          text: "test report text"
        }
      });
    });
  });
});
