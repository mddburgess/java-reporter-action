import {findFile, findFiles} from '../files';

describe('findFiles()', () => {

    it('should return an array of found files', async () => {
        const paths = await findFiles('src/**/*.ts');
        expect(paths.length).toBeGreaterThan(0);
    });

    it('should return an empty array when no files are found', async () => {
        const paths = await findFiles('**/*.pdf');
        expect(paths.length).toEqual(0);
    });
});

describe('findFile()', () => {

    it('should return a path of a found file', async () => {
        const path = await findFile('package.json');
        expect(path).toMatch(RegExp('/.*/package\\.json'));
    });

    it('should return undefined when no file is found', async () => {
        const path = await findFile('pom.xml');
        expect(path).toBeUndefined();
    })
});
