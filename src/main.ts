import * as core from "@actions/core";
import Check from "./check";
import SurefireCheck from "./surefire/check";
import PmdCheck from "./pmd/check";

const main = async () => {
  const checks: Check<any>[] = [new SurefireCheck(), new PmdCheck()];

  for (const check of checks) {
    await check.run();
  }
};

main()
  .catch((error) => core.setFailed(error))
  .finally(() => core.info("Java Reporter finished."));
