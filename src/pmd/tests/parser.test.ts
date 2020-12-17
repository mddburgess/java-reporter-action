import fs from 'fs';
import {findFile} from '../../common/files';
import {PmdParser} from '../parser';

describe('PMD parser', () => {

    it('can parse a PMD report', async () => {
        const path = await findFile('**/pmd.xml');
        const xml = await fs.promises.readFile(path);

        const pmdReport = new PmdParser().parse(xml);
        expect(pmdReport).toMatchSnapshot();
    });
});
