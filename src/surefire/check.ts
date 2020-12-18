import Check from '../common/check';

class SurefireCheck extends Check {

    constructor() {
        super('Surefire');
    }

    protected reportSearchPaths(): string[] {
        return ['**/target/surefire-reports/TEST-*.xml'];
    }
}

export default SurefireCheck;
