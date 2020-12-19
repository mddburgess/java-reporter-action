import * as core from '@actions/core';
import CheckstyleCheck from './checkstyle/check';
import CpdCheck from './cpd/check';
import PmdCheck from './pmd/check';
import SpotbugsCheck from './spotbugs/check';
import SurefireCheck from './surefire/check';

async function main() {

    const checks = [
        new SurefireCheck(),
        new PmdCheck(),
        new CpdCheck(),
        new SpotbugsCheck(),
        new CheckstyleCheck()
    ];

    for (const check of checks) {
        await check.run();
    }
}

main()
    .catch(error => core.setFailed(error))
    .finally(() => core.info('Java Reporter finished.'));
