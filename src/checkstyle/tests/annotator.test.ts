import {findFile} from '../../common/files';
import CheckstyleReportReader from '../reader';
import CheckstyleAnnotator from '../annotator';

describe('Checkstyle annotator', () => {

    it('can annotate a Checkstyle report', async () => {
        const reportPath = await findFile('**/checkstyle-result.xml');
        const report = new CheckstyleReportReader().readReport(reportPath) || fail();
        const annotations = await new CheckstyleAnnotator().annotate(report);
        annotations.forEach(annotation => expect(annotation).toMatchSnapshot({
            path: expect.any(String)
        }));
    });
});
