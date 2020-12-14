export interface SurefireReport {

    tests: number;
    failures: number;
    errors: number;
    skipped: number;
    testCases: SurefireTestCase[];
}

export interface SurefireTestCase {

    className: string;
    testName: string;
    result?: 'failure' | 'error' | 'skipped';
    message?: string;
    stackTrace?: string;
}
