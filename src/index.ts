import * as core from '@actions/core';
import {checkSurefire} from './surefire';
import {checkPmd} from './pmd/main';

checkSurefire()
    .catch(error => core.setFailed(error))
    .finally(() => core.info('Surefire check finished.'));

checkPmd()
    .catch(error => core.setFailed(error))
    .finally(() => core.info('PMD check finished.'));
