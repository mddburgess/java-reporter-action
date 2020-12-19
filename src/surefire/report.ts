interface SurefireReport {

    tests: number;
    failures: number;
    errors: number;
    skipped: number;
    testCases: SurefireTestCase[];
}

interface SurefireTestCase {

    className: string;
    testName: string;
    result?: SurefireTestResult;
    message?: string;
    stackTrace?: string;
}

type SurefireTestResult =
    | 'success'
    | 'failure'
    | 'error'
    | 'skipped';

export {
    SurefireTestCase,
    SurefireTestResult
};
export default SurefireReport;
