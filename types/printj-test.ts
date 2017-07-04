import { vsprintf, sprintf } from 'printj';

const t1: string = sprintf("%02hhx", 123);
const t2: string = vsprintf("%02hhx %d", [123, 213]);
