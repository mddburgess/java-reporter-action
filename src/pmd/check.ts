import Check from '../common/check';

class PmdCheck extends Check {

    constructor() {
        super('pmd');
    }

    protected reportSearchPaths(): string[] {
        return ['**/target/pmd.xml'];
    }
}

export default PmdCheck;
