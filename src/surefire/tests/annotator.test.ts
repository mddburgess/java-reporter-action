import {findFile} from '../../common/files';
import SurefireReportReader from '../reader';
import SurefireAnnotator from '../annotator';


describe('Surefire annotator', () => {

    jest.setTimeout(10000);

    it('can annotate a Surefire report', async () => {
        const reportPath = await findFile('**/TEST-org.example.SimpleTest.xml');
        const report = new SurefireReportReader().readReport(reportPath) || fail();
        const annotations = await new SurefireAnnotator().annotate(report);
        expect(annotations).toMatchSnapshot();
    });
});
