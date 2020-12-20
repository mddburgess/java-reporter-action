import {findFile} from '../../common/files';
import SpotbugsReportReader from '../reader';
import SpotbugsAnnotator from '../annotator';

describe('SpotBugs annotator', () => {

    jest.setTimeout(10000);

    it('can annotate a SpotBugs report', async () => {
        const reportPath = await findFile('**/spotbugsXml.xml');
        const report = new SpotbugsReportReader().readReport(reportPath) || fail();
        const annotations = await new SpotbugsAnnotator().annotate(report);
        expect(annotations).toMatchSnapshot();
    });
});
