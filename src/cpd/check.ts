import Check from '../common/check';

class CpdCheck extends Check {

    constructor() {
        super('CPD');
    }

    protected reportSearchPaths(): string[] {
        return ['**/target/cpd.xml'];
    }
}

export default CpdCheck;
