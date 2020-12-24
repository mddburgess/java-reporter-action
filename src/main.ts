import * as core from "@actions/core";

const main = async () => {
  core.info("Hello world!");
};

main()
  .catch((error) => core.setFailed(error))
  .finally(() => core.info("Java Reporter finished."));
