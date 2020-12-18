import Check from '../common/check';

class CpdCheck extends Check {

    constructor() {
        super('cpd');
    }

    protected reportSearchPaths(): string[] {
        return ['**/target/cpd.xml'];
    }
}

export default CpdCheck;
