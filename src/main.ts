import * as core from "@actions/core";
import Check from "./check";
import SurefireParser from "./surefire/parser";
import PmdParser from "./pmd/parser";
import CpdParser from "./cpd/parser";
import SpotbugsParser from "./spotbugs/parser";
import CheckstyleParser from "./checkstyle/parser";
import SurefireCheck from "./surefire/check";

const main = async () => {
  const checks: Check<any>[] = [
    new SurefireCheck(),
    // new Check("pmd", "PMD", new PmdParser()),
    // new Check("cpd", "CPD", new CpdParser()),
    // new Check("spotbugs", "SpotBugs", new SpotbugsParser()),
    // new Check("checkstyle", "Checkstyle", new CheckstyleParser()),
  ];

  for (const check of checks) {
    await check.run();
  }
};

main()
  .catch((error) => core.setFailed(error))
  .finally(() => core.info("Java Reporter finished."));
