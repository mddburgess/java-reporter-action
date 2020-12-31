import * as core from "@actions/core";
import SurefireCheck from "./surefire/check";
import PmdCheck from "./pmd/check";
import CpdCheck from "./cpd/check";
import SpotbugsCheck from "./spotbugs/check";

const main = async () => {
  const checks = [new SurefireCheck(), new PmdCheck(), new CpdCheck(), new SpotbugsCheck()];

  for (const check of checks) {
    await check.run();
  }
};

main()
  .catch((error) => core.setFailed(error))
  .finally(() => core.info("Java Reporter finished."));
