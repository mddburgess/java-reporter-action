import {findSurefireReports} from '../index';

describe('findSurefireReports()', () => {

    it('should find Surefire reports', async () => {
        const reportPaths = await findSurefireReports(['**/surefire-reports/TEST-*.xml']);
        expect(reportPaths.length).toEqual(1);
    });
})
