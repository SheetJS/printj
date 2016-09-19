/* unsigned int */
var uints =	[ "0", "1", "2", "4", "8", "16", "32", "64", "69", "128", "256", "259", "512", "1024", "1559","2048", "3333", "4096", "5678", "8192", "10111", "16384", "24681", "32768", "45678", "65536", "121211", "131072", "141427", "262144", "314159", "524288", "888888", "1048576", "1515151", "2097152", "3333333", "4194304", "4565456", "8388608", "13245125", "16777216", "27182818", "33554432", "34567654", "67108864", "99999999", "134217728", "201201201", "268435456", "298929892","536870912", "1000000000", "1073741824", "2011021011", "2147483648", "3743743743", "4294967296", "7876787678", "8589934592", "11111111111", "17179869184", "21347111829", "34359738368", "45678901234", "68719476736", "78987898789", "137438953472", "137438953473", "274877906944", "274877906945", "549755813888", "549755813889", "1099511627776", "1099511627777", "2199023255552", "2199023255553", "4398046511104", "4398046511105", "8796093022208", "8796093022209", "17592186044416", "17592186044417", "35184372088832", "35184372088833", "70368744177664", "70368744177665", "140737488355328", "140737488355329", "281474976710656", "281494978750657", "562949953421312", "562949953421313","1125899906842624","1125899906843625", "2251799813685248" ]

/* int */
var ints = []; for(var i = 0; i < uints.length; ++i) ints.push((i % 2 ? "-" : "") + uints[i]);

function posneg(o,i) { i.forEach(function(x) { o.push(x); o.push("-" + x); }); }

/* double / long double */
var pdbl = [
	"0.", "INFINITY", "1.", "500.", ".0003",
	"1.2", ".000000000069", "69000000000.",
	"2.51", "4.37e19", "8.17e-19",
	"3.141", "2.718e19", "5.772e-19"
];
var doubles = []; posneg(doubles, pdbl);

/* char * / wchar_t * */
var strings = ['"v"', '"pq"', '"var"', '"rama"', '"sheet"', '"sheets"', '"sheetjs"', '"somberi"', '"function"', '"variadics"', '"javascript"', '"sesquipedalian"'];

/* signed char */
var schar = ["'\\0'", "'A'", "'z'", "'q'", "-1", "-127", "-128", "12345", "-12345"];
/* unsigned char */
var uchar = ["'\\0'", "'A'", "'z'", "'Q'", "-1", "-127", "-128", "12345", "45678"];

/* unsigned long */
var ulongs = ["10", "30", "100", "300", "1000", "1234", "3000", "4321"];

/* long */
var longs = []; posneg(longs, ulongs);

/* unsigned long long */
var ullongs = ["123", "456", "4543216", "1123412343", "100000000000", "2131000000000", "987654321", "1000123000000", "1234567890", "2718281828", "31415926535", "677215664901", "16180339887", "4669201609", "2813308004"];

for(var i = 1; i < uints.length; i+=2) ullongs.push(uints[i]);

/* long long */
var llongs = []; posneg(llongs, ullongs);

var tests = [
	ints,
	uints,
	doubles,
	doubles,
	strings, strings,
	schar, uchar,
	ints,
	uints,
	longs,
	ulongs,
	llongs,
	ullongs,
	llongs,
	ullongs,
	ullongs,
	llongs,
	llongs,
	ullongs
]

var maxlen = 0;
for(var i = 0; i < tests.length; ++i) maxlen = Math.max(maxlen,tests[i].length);
for(var j = 0; j < maxlen; ++j) {
	var args = [];
	for(i=0; i < tests.length; ++i) args.push(tests[i][j % tests[i].length]);
[ "stress(",
"	" + args[0] + ",",
"	CAST_U(" + args[1] + "),",
"	" + args[2] + ",",
"	" + (args[3].match(/INF/) ? "" : "CAST_LD") + "(" + args[3] + "),",
"	" + args[4] + ",",
"	CAST_WSTR(" + args[5] + "),",
"	CAST_CHAR(" + args[6] + "),",
"	CAST_UCHAR(" + args[7] + "),",
"	CAST_SHORT(" + args[8] + "),",
"	CAST_USHORT(" + args[9] + "),",
"	CAST_L(" + args[10] + "),",
"	CAST_UL(" + args[11] + "),",
"	CAST_LL(" + args[12] + "),",
"	CAST_ULL(" + args[13] + "),",
"	CAST_INTMAX_T(" + args[14] + "),",
"	CAST_UINTMAX_T(" + args[15] + "),",
"	CAST_SIZE_T(" + args[16] + "),",
"	CAST_SSIZE_T(" + args[17] + "),",
"	CAST_PTRDIFF_T(" + args[18] + "),",
"	CAST_UINTPTR_T(" + args[19] + ")",
");\n"].forEach(function(x) { console.log(x); });
}
