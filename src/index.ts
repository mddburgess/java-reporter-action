import * as core from '@actions/core';
import {checkSurefire} from './surefire';

checkSurefire()
    .catch(error => core.setFailed(error))
    .finally(() => core.info('Surefire check finished.'));
