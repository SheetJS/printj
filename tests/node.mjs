#!/usr/bin/env node --experimental-modules

import { version, sprintf } from '../printj.mjs'

console.log(sprintf("PRINTJ version %s, 123 = 0x%02hhx", version, 123));
