import Github from "./index";
import { CheckConclusion, CheckRequest } from "./types";

export default class CheckRun {
  private readonly github: Github;
  private readonly name: string;
  private checkRunId?: number;

  constructor(name: string) {
    this.github = new Github();
    this.name = name;
  }

  async queue() {
    await this.saveCheck({ status: "queued" });
  }

  async complete(conclusion: CheckConclusion) {
    await this.saveCheck({ status: "completed", conclusion });
  }

  async saveCheck(request: CheckRequest) {
    if (this.checkRunId === undefined) {
      this.checkRunId = await this.github.createCheck({
        name: this.name,
        ...request,
      });
    } else {
      await this.github.updateCheck({
        check_run_id: this.checkRunId,
        ...request,
      });
    }
  }
}
