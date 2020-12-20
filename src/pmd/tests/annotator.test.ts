import {findFile} from '../../common/files';
import PmdReportReader from '../reader';
import PmdAnnotator from '../annotator';

describe('PMD annotator', () => {

    it('can annotate a PMD report', async () => {
        const reportPath = await findFile('**/pmd.xml');
        const report = new PmdReportReader().readReport(reportPath) || fail();
        const annotations = new PmdAnnotator().annotate(report);
        annotations.forEach(annotation => expect(annotation).toMatchSnapshot({
            path: expect.any(String)
        }));
    });

    it('can handle a clean PMD report', () => {
        const report = {violations: []};
        const annotations = new PmdAnnotator().annotate(report);
        expect(annotations).toEqual([]);
    })
});
