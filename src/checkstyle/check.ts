import Check from '../common/check';

class CheckstyleCheck extends Check {

    constructor() {
        super('Checkstyle');
    }

    protected reportSearchPaths(): string[] {
        return ['**/checkstyle-result.xml'];
    }
}

export default CheckstyleCheck;
