import {findFile, findFiles, findRelativePath} from '../files';

describe('findFiles()', () => {

    it('should return an array of found files', async () => {
        const paths = await findFiles(['src/**/*.ts']);
        expect(paths.length).toBeGreaterThan(0);
    });

    it('should return an empty array when no files are found', async () => {
        const paths = await findFiles(['**/*.pdf']);
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

describe('findRelativePath()', () => {

    it('should return the relative path of a found file', async () => {
        const path = await findRelativePath('**/SimpleTest.java');
        expect(path).toEqual('example/src/test/java/org/example/SimpleTest.java');
    });

    it('should return undefined when no file is found', async () => {
        const path = await findRelativePath('**/NotFound.java');
        expect(path).toBeUndefined();
    })
})
