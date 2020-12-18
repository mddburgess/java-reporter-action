import Check from '../common/check';

class SpotbugsCheck extends Check {

    constructor() {
        super('spotbugs');
    }

    protected reportSearchPaths(): string[] {
        return ['**/target/spotbugsXml.xml'];
    }
}

export default SpotbugsCheck;
