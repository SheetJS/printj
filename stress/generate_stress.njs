/* vim: set ft=javascript: */

var S = {
	/* valid formats */
	"formats":"diouxXfeEgGaAcsCS".split(""),
	/* flags and applicable convs */
	"flags": [
		["'", "diufFgG"],
		["-", "diouxXfeEgGaAcsCS"],
		["+", "diaAeEfFgG"],
		[" ", "diaAeEfFgG"],
		["#", "oxXaAeEfFgG"],
		["0", "diouxXaAeEfFgG"]
	],
	/* lengths and applicable convs */
	"lengths": [
		["hh", "diouxX"],
		["h",  "diouxX"],
		["l",  "diouxXcs"],
		["ll", "diouxX"],
		["j",  "diouxX"],
		["z",  "diouxX"],
		["t",  "diouxX"],
		["L",  "aAeEfFgG"]
	],
	"widths": [ "", "0", "1", "2", "4", "6", "8", "12" ],
	"precs":  [ "", "0", "1", "2", "4", "6", "8", "12" ].map(function(x) { return x == "" ? "" : "." + x; }),
	/* implied data types */
	"types": [
		["i", "dicC"],
		["u", "ouxX"],
		["d", "feEfFgGaA"],
		["s", "sS"],
	],
	/* override for lengths */
	"typelen": { "C": "l", "S": "l" }
};

/*
	int i; unsigned int u;
	double d; long double ld;
	char *s; wchar_t *ws;
	signed char hhi; unsigned char hhu; short hi; unsigned short hu;
	long li; unsigned long lu; long long lli; unsigned long long llu;
	intmax_t ji; uintmax_t ju; size_t zi, ssize_t zu; ptrdiff_t ti; uintptr_t tu;
 */
function getarg(format/*:string*/, length/*:string*/)/*:string*/ {
	var type = types[format];
	if(!length) length = S.typelen[format] || "";
	if(!length) return type;
	switch(type) {
		case 's': return "ws";
		case 'd': if(length == "L") return "ld";
		case 'i': case 'u': return length + type; 
	}
	return type;
}

var platform = require("os").platform();

function doit(format/*:string*/, flag/*:string*/, length/*:string*/, width/*:string*/, prec/*:string*/) {
	/* skip wide char */
	if(format == "C" || (format == "c" && length == "l")) return;
	/* skip char */
	if(format == "c") return;
	/* skip precision-less long double */
	if(format.toLowerCase() == "a" && length == "L" && prec == "") return;

	var fmt = "%" + flag + width + prec + length + format;
	var printf_stmt = 'printf("' + fmt + '\\n", ' + getarg(format, length) + ');';
	console.log(printf_stmt);
}

function pick(arr/*:Array<string>*/)/*:Array<string>*/ {
	var O = [];
	for(var i = 0; i < (1<<arr.length); ++i) {
		var o = "";
		for(var j = 0; j < arr.length; ++j) if(i & (1<<j)) o += arr[j];
		O.push(o);
	}
	return O;
}

var flags = {}, lengths = {}, types = {};
S.formats.forEach(function(f) { flags[f]=[]; lengths[f]=[""]; types[f]=""; });

S.types.forEach(function(f) { var g = f[1].split(""); g.forEach(function(h) { types[h] = f[0]; }); });

S.lengths.forEach(function(f) {
	var g = f[1].split("");
	g.forEach(function(h) { if(lengths[h]) lengths[h].push(f[0]); });
});

S.flags.forEach(function(f) {
	var g = f[1].split("");
	g.forEach(function(h) { if(flags[h]) flags[h].push(f[0]); });
});
S.formats.forEach(function(f) { flags[f] = pick(flags[f]); });

var filters = {
	dint: "diu",
	oint: "o",
	hint: "xX",
	ddbl: "feEgG",
	hdbl: "aA",
	chr: "cC",
	str: "sS"
};
filters.int = filters.dint + filters.hint + filters.oint;
filters.dbl = filters.ddbl + filters.hdbl;
filters.all = filters.int + filters.dbl + filters.chr + filters.str;

var filter = filters.all;


S.formats.forEach(function(format) {
	if(filter && filter.indexOf(format) == -1) return;
	flags[format].forEach(function(flag) {
		lengths[format].forEach(function(length) {
			S.widths.forEach(function(width) {
				S.precs.forEach(function(prec) {
					doit(format, flag, length, width, prec);
				});
			});
		});
	});
});
