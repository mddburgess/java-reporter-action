import {findFile} from '../../common/files';
import CheckstyleReportReader from '../reader';

describe('Checkstyle report reader', () => {

    it('can read a Checkstyle report', async () => {
        const reportPath = await findFile('**/checkstyle-result.xml');
        const report = new CheckstyleReportReader().readReport(reportPath);
        expect(report).toMatchSnapshot();
    });
});
