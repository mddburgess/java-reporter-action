import * as core from "@actions/core";
import SurefireCheck from "./surefire/check";
import PmdCheck from "./pmd/check";
import CpdCheck from "./cpd/check";
import SpotbugsCheck from "./spotbugs/check";
import CheckstyleCheck from "./checkstyle/check";
import { loadClasspath } from "./common/files";

const main = async () => {
  const classpath = await loadClasspath();

  const checks = [
    new SurefireCheck(classpath),
    new PmdCheck(),
    new CpdCheck(),
    new SpotbugsCheck(classpath),
    new CheckstyleCheck(),
  ];

  for (const check of checks) {
    await check.run();
  }
};

main()
  .catch((error) => core.setFailed(error))
  .finally(() => core.info("Java Reporter finished."));
