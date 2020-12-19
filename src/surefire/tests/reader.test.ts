import {findFile} from '../../common/files';
import SurefireReportReader from '../reader';

describe('Surefire report reader', () => {

    it('can read a Surefire report', async () => {
        const reportPath = await findFile('**/TEST-org.example.SimpleTest.xml');
        console.log(reportPath);
        const report = new SurefireReportReader().readReport(reportPath);
        expect(report).toMatchSnapshot();
    });
});
