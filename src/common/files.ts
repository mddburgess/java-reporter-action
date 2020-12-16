import * as glob from '@actions/glob';

export async function findFiles(searchPaths: string) {
    const patterns = searchPaths.split(',');
    const globber = await glob.create(patterns.join('\n'));
    const paths = await globber.glob();
    return paths;
}

export async function findFile(searchPath: string) {
    const paths = await findFiles(searchPath);
    return paths[0];
}

export async function findRelativePath(searchPath: string) {
    const globber = await glob.create(searchPath);
    const searchRoot = globber.getSearchPaths()[0];
    const absolutePaths = await globber.glob();
    return absolutePaths[0].slice(searchRoot.length + 1);
}
