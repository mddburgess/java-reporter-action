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

    it('can handle a clean Surefire report', async () => {
        const report = {
            tests: 1,
            failures: 0,
            errors: 0,
            skipped: 0,
            testCases: [],
        };
        const annotations = await new SurefireAnnotator().annotate(report);
        expect(annotations).toEqual([]);
    });
});
