import * as fs from 'fs';
import {SurefireParser} from '../parser';
import {findFile} from '../../common/files';

describe('Surefire parser', () => {

    it('can parse a simple Surefire report', async () => {
        const path = await findFile('**/TEST-com.example.demo.SimpleTest.xml');
        const xml = await fs.promises.readFile(path);

        const surefireReport = new SurefireParser().parse(xml);
        expect(surefireReport).toMatchSnapshot();
    })
})
