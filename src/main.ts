import * as core from "@actions/core";
import SurefireCheck from "./surefire/check";
import PmdCheck from "./pmd/check";
import CpdCheck from "./cpd/check";

const main = async () => {
  const checks = [new SurefireCheck(), new PmdCheck(), new CpdCheck()];

  for (const check of checks) {
    await check.run();
  }
};

main()
  .catch((error) => core.setFailed(error))
  .finally(() => core.info("Java Reporter finished."));
