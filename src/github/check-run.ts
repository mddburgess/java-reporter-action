import GitHub from "./index";
import { CheckRequest } from "./types";
import CheckResult from "../check/result";
import { chunk } from "../common/utils";
import { compareAnnotations } from "./utils";

export default class CheckRun {
  private readonly name: string;
  private checkRunId?: number;

  constructor(name: string) {
    this.name = name;
  }

  queue = async (): Promise<void> => {
    await this.saveCheck({ status: "queued" });
  };

  complete = async (result: CheckResult): Promise<void> => {
    const chunks = chunk(result.annotations.sort(compareAnnotations), 50);
    for (const annotations of chunks) {
      await this.saveCheck({
        status: "completed",
        conclusion: result.conclusion,
        output: {
          title: result.title,
          summary: result.summary,
          text: result.text,
          annotations: annotations,
        },
      });
    }
  };

  private saveCheck = async (request: CheckRequest): Promise<void> => {
    if (this.checkRunId === undefined) {
      this.checkRunId = await GitHub.createCheck({
        name: this.name,
        ...request,
      });
    } else {
      return GitHub.updateCheck({
        check_run_id: this.checkRunId,
        ...request,
      });
    }
  };
}
