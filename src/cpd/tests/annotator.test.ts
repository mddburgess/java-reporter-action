import {findFile} from '../../common/files';
import CpdReportReader from '../reader';
import CpdAnnotator from '../annotator';

describe('CPD annotator', () => {

    it('can annotate a CPD report', async () => {
        const reportPath = await findFile('**/cpd.xml');
        const report = new CpdReportReader().readReport(reportPath) || fail();
        const annotations = new CpdAnnotator().annotate(report);
        annotations.forEach(annotation => expect(annotation).toMatchSnapshot({
            path: expect.any(String),
            message: expect.any(String)
        }));
    });

    it('can handle a clean CPD report', () => {
        const report = {duplications: []};
        const annotations = new CpdAnnotator().annotate(report);
        expect(annotations).toEqual([]);
    })
});
