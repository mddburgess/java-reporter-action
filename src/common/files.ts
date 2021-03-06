import * as glob from "@actions/glob";

export async function loadClasspath(): Promise<string[]> {
  const globber = await glob.create("**/*.java");
  const searchPath = globber.getSearchPaths()[0];
  const javaPaths = await globber.glob();
  return javaPaths.map((path) => path.slice(searchPath.length + 1));
}
