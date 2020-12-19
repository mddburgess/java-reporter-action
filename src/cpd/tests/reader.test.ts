import {findFile} from '../../common/files';
import CpdReportReader from '../reader';

describe('CPD report reader', () => {

    it('can read a PMD report', async () => {
        const reportPath = await findFile('**/cpd.xml');
        const report = new CpdReportReader().readReport(reportPath);
        expect(report).toMatchSnapshot();
    });
});
