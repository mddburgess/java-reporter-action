import {findFile} from '../../common/files';
import SpotbugsReportReader from '../reader';

describe('SpotBugs report reader', () => {

    it('can read a SpotBugs report', async () => {
        const reportPath = await findFile('**/spotbugsXml.xml');
        const report = new SpotbugsReportReader().readReport(reportPath);
        expect(report).toMatchSnapshot();
    });
});
