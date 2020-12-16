import * as core from '@actions/core';
import {checkSurefire} from './surefire';

checkSurefire()
    .finally(() => core.info('Surefire check finished.'));
