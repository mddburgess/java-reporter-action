import * as core from "@actions/core";
import Check from "./check";

const main = async () => {
  const checks: Check[] = [
    new Check("surefire", "Surefire"),
    new Check("pmd", "PMD"),
    new Check("cpd", "CPD"),
    new Check("spotbugs", "SpotBugs"),
    new Check("checkstyle", "Checkstyle"),
  ];

  for (const check of checks) {
    await check.run();
  }
};

main()
  .catch((error) => core.setFailed(error))
  .finally(() => core.info("Java Reporter finished."));
