import {findFile} from '../../common/files';
import PmdReportReader from '../reader';

describe('PMD report reader', () => {

    it('can read a PMD report', async () => {
        const reportPath = await findFile('**/pmd.xml');
        const report = new PmdReportReader().readReport(reportPath);
        expect(report).toMatchSnapshot();
    });
});
