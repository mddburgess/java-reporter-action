import * as core from '@actions/core';
import {checkSurefire} from './surefire';
import {checkPmd} from './pmd/main';

const main = async () => {
    await checkSurefire();
    await checkPmd();
}

main()
    .catch(error => core.setFailed(error))
    .finally(() => core.info('Java Reporter finished.'));
