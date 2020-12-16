import * as glob from '@actions/glob';

export async function findFiles(searchPaths: string[]) {
    const globber = await glob.create(searchPaths.join('\n'));
    return await globber.glob();
}

export async function findFile(searchPath: string) {
    const paths = await findFiles([searchPath]);
    return paths[0];
}

export async function findRelativePath(searchPath: string) {
    const globber = await glob.create(searchPath);
    const searchRoot = globber.getSearchPaths()[0];
    const absolutePaths = await globber.glob();
    return absolutePaths[0] && absolutePaths[0].slice(searchRoot.length + 1);
}
