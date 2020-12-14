import * as glob from '@actions/glob';
import {Logger} from 'tslog';

const log = new Logger({
    displayFunctionName: false
});

export async function findFiles(searchPaths: string) {
    const patterns = searchPaths.split(',');
    log.debug('Searching paths', patterns);

    const globber = await glob.create(patterns.join('\n'));
    const paths = await globber.glob();

    log.debug(`Found ${paths.length} paths`, paths);
    return paths;
}

export async function findFile(searchPath: string) {
    const paths = await findFiles(searchPath);
    return paths[0];
}
