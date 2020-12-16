import {resolveLine, resolvePath, toAnnotation} from '../annotator';

describe('toAnnotation()', () => {

    it('can convert a Surefire test case to a GitHub annotation', async () => {
        const annotation = await toAnnotation({
            className: 'org.example.SimpleTest',
            testName: 'failingTestWithoutMessage',
            result: 'failure',
            message: undefined,
            stackTrace: 'org.opentest4j.AssertionFailedError: \n' +
                '\tat org.example.SimpleTest.failingTestWithoutMessage(SimpleTest.java:24)\n',
        });
        expect(annotation).toEqual({
            path: 'example/src/test/java/org/example/SimpleTest.java',
            start_line: 24,
            end_line: 24,
            annotation_level: 'failure',
            title: 'SimpleTest.failingTestWithoutMessage',
            message: 'org.opentest4j.AssertionFailedError: \n' +
                '\tat org.example.SimpleTest.failingTestWithoutMessage(SimpleTest.java:24)\n',
            raw_details: 'org.opentest4j.AssertionFailedError: \n' +
                '\tat org.example.SimpleTest.failingTestWithoutMessage(SimpleTest.java:24)\n'
        })
    })
})

describe('resolvePath()', () => {

    it('can resolve a path from a class name', async () => {
        const path = await resolvePath('org.example.SimpleTest');
        expect(path).toEqual('example/src/test/java/org/example/SimpleTest.java');
    });
});

describe('resolveLine()', () => {

    it('can resolve a line from a stacktrace', () => {
        const line = resolveLine({
            className: 'org.example.SimpleTest',
            testName: 'failingTestWithoutMessage',
            stackTrace: 'org.opentest4j.AssertionFailedError: \n' +
                '\tat org.example.SimpleTest.failingTestWithoutMessage(SimpleTest.java:24)'
        });
        expect(line).toEqual(24);
    });

    it('returns 0 when a stacktrace is not available', () => {
        const line = resolveLine({
            className: 'org.example.SimpleTest',
            testName: 'disabledTest',
            message: 'void org.example.SimpleTest.disabledTest() is @Disabled'
        });
        expect(line).toEqual(0);
    })
})
