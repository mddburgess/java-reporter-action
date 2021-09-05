import * as core from "@actions/core";
import * as glob from "@actions/glob";

const classpath: string[] = [];

export const loadClasspath = async (): Promise<string[]> => {
  if (classpath === []) {
    core.info("Loading classpath");

    const globber = await glob.create("**/*.java");
    const searchPath = globber.getSearchPaths()[0];
    const javaPaths = await globber.glob();
    classpath.push(...javaPaths.map((path) => path.slice(searchPath.length + 1)));

    core.startGroup("Classpath loaded");
    classpath.forEach(core.info);
    core.endGroup();
  }
  return classpath;
};

export const findClasspath = (path: string): string | undefined =>
  classpath.filter((cp) => cp.endsWith(path))[0];
