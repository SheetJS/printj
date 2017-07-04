/* printj.ts (C) 2016-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2 ft=typescript: */
/*jshint node:true, evil:true */
import X = require("printj");
let argv = ["n:1","a","e:null","f:3.4", "b:true", "e:1+1"];

function help() {
[
"usage: printj [options] <format> [args...]",
"",
"Options:",
"    -h, --help      output usage information",
"",
"Arguments are treated as strings unless prefaced by a type indicator:",
"    n:<integer>     call parseInt (ex. n:3 -> 3)",
"    f:<float>       call parseFloat (ex. f:3.1 -> 3.1)",
'    b:<boolean>     false when lowercase value is "FALSE" or "0", else true',
"    s:<string>      interpret as string (ex. s:n:3 -> \"n:3\")",
"    j:<JSON>        interpret as an object using JSON.parse",
"    e:<JS>          evaluate argument (ex. e:1+1 -> 2, e:\"1\"+1 -> \"11\")",
"",
"samples:",
"    $ printj '|%02hhx%d|' n:50 e:0x7B                # |32123|",
"    $ printj '|%2$d + %3$d is %1$d|' e:1+2 n:1 n:2   # |1 + 2 is 3| ",
"    $ printj '|%s is %s|' s:1+2 e:1+2                # |1+2 is 3|",
"    $ printj '|%c %c|' s:69 n:69                     # |6 E|",
"",
"Support email: dev@sheetjs.com",
"Web Demo: http://oss.sheetjs.com/printj/"
].forEach(function(l) { console.log(l); });
return 0;
}

function parse_arg(arg: string): any {
	let m: string = arg.substr(2), p: number = 0;
	if(arg.charCodeAt(1) === 58) switch((p = arg.charCodeAt(0))) {
		case /*n*/ 110: return parseInt(m, 10);
		case /*f*/ 102: return parseFloat(m);
		case /*b*/  98: return !(m.toUpperCase() === "FALSE" || m === "0");
		case /*j*/ 106: return JSON.parse(m);
		case /*s*/ 115: return m;
	}
	return arg;
}

let args: any[] = [];
let fmt = "", n = 0;
for(let i = 2; i < argv.length; ++i) switch(argv[i]) {
	case "--help": case "-h": break;
	default: if(n++ === 0) fmt = argv[i]; else args.push(parse_arg(argv[i]));
}

console.log(X.vsprintf(fmt, args));
