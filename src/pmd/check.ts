import Check from '../common/check';

class PmdCheck extends Check {

    public constructor() {
        super('PMD');
    }

    protected reportSearchPaths(): string[] {
        return ['**/target/pmd.xml'];
    }
}

export default PmdCheck;
