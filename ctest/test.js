/* vim: set ts=2: */
var X;
var IMPLS = {}, IMPLA = [], IMPL = [];
if(typeof require !== 'undefined') {
	assert = require('assert');
	X=require('./');
	IMPL = require("./lib/impl.json");
	IMPL.forEach(function(impl, i) { IMPLS[impl] = IMPLA[i] = require("./lib/" + impl); });
} else {
	X = PRINTJ;
	IMPL.push("base"); IMPLS["base"] = IMPLA[IMPL.length-1] = X;
}

function msieversion()
{
	if(typeof window == 'undefined') return Infinity;
	if(typeof window.navigator == 'undefined') return Infinity;
	var ua = window.navigator.userAgent
	var msie = ua.indexOf ( "MSIE " )
	if(msie < 0) return Infinity;
	return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
}

function isopera() {
	if(typeof window == 'undefined') return false;
	if(typeof window.navigator == 'undefined') return false;
	var ua = window.navigator.userAgent;
	return ua.indexOf("Opera") > -1;
}

function compare_parse(a,b) {
	assert.equal(a.length, b.length);
	for(var i = 0; i < a.length; ++i) {
		for(var j = 0; j < a[i].length; ++j) {
			if((a[i][j] || "") != (b[i][j] || "")) {
				throw i + "," + j + " " + a[i] + " " + b[i];
			}
		}
	}
}

if(typeof require !== 'undefined') describe('consensus', function() {
	it('tokenizer', function() {
		var COMPARE = require("./tests/compare.json");
		COMPARE.forEach(function(m) {
			var base = IMPLA[0]._tokenize(m);
			for(var i = 1; i < IMPLA.length; ++i) compare_parse(base, IMPLA[i]._tokenize(m));
		});
	});
});

describe('correctness', function() {
	var PRINTF = typeof tests !== 'undefined' ? tests : require("./tests/printf");
	IMPL.forEach(function(n,i) {
		var impl = IMPLA[i];
		it(n, function() {
			PRINTF.forEach(function(v) {
				if(impl.sprintf.apply(impl, v[0]) != v[1]) {
					if(isopera() && v[0][0].match(/^%.*[Aa]$/)) return;
					console.log(v);
					assert.equal(impl.sprintf.apply(impl, v[0]), v[1]);
				}
			});
		});
	});
});

var sprintf = X.sprintf;
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ !\"#$%&'()*+,-./0123456789:;<=>?@[\\]^_~{|}`".split("");
var convs = "aAbBcCdDeEfFgGiJmnoOpsSTuUVxXyY%".split("");
var flags = " #'+-0".split("");
var digits = "0123456789".split("");
var lens = "hIjlLqtwzZ".split(""); lens.push("hh"); lens.push("ll");
var other = "$*.".split("");
var unused = []; chars.forEach(function(c) {
	if(convs.indexOf(c) == -1  &&
	   flags.indexOf(c) == -1  &&
	   digits.indexOf(c) == -1 &&
	   lens.indexOf(c) == -1   &&
	   other.indexOf(c) == -1
	) unused.push(c);
});

describe('special cases', function() {
	it('fails on unrecognized format chars: ' + unused.join(""), function() {
		unused.forEach(function(c) {
			assert.throws(function() { sprintf("%" + c, 0); }, "Should fail on %" +c);
		});
	});
	it('accepts all expected conversions: ' + convs.join(""), function() {
		convs.forEach(function(c) {
			assert.doesNotThrow(function() { sprintf("%" + c, 0); }, "Should pass on %" +c);
		});
	});
	it('accepts all expected lengths: ' + lens.join(""), function() {
		lens.forEach(function(l) {
			var fmt = "%" + l + "X";
			assert.doesNotThrow(function() { sprintf(fmt, 0); }, "Should pass on "+fmt);
		});
	});
	it('accepts all expected flags: ' + flags.join(""), function() {
		flags.forEach(function(l) {
			var fmt = "%" + l + "X";
			assert.doesNotThrow(function() { sprintf(fmt, 0); }, "Should pass on "+fmt);
		});
	});
	it('correctly handles character conversions: cC', function() {
		assert.equal(sprintf("|%c %c|", "69", 69), "|6 E|");
		assert.equal(sprintf("|%c|", {toString:function() { return "69"; }, valueOf: function() { return 69; }} ), "|6|");
	});
	it('correctly handles error conversion: m', function() {
		var x = new Error("sheetjs");
		x.errno = 69; x.toString = function() { return "SHEETJS"; };
		assert.equal(sprintf("|%#m|", x), "|sheetjs|");
		delete x.message;
		assert.equal(sprintf("|%#m|", x), "|Error number 69|");
		delete x.errno;
		assert.equal(sprintf("|%#m|", x), "|Error SHEETJS|");
	});
	it('correctly handles typeof and valueOf conversions: TV', function() {
		assert.equal(sprintf("%1$T %1$#T", 1), 'number Number');
		assert.equal(sprintf("%1$T %1$#T", 'foo'), 'string String');
		assert.equal(sprintf("%1$T %1$#T", [1,2,3]), 'object Array');
		assert.equal(sprintf("%1$T %1$#T", null).replace(/Object|global/, "Null"), 'object Null');
		assert.equal(sprintf("%1$T %1$#T", undefined).replace(/Object|global/, "Undefined"), 'undefined Undefined');

		var _f = function() { return "f"; };
		var _3 = function() { return 3; };
		assert.equal(sprintf("%1$d %1$s %1$V", {toString:_f}), '0 f f');
		assert.equal(sprintf("%1$d %1$s %1$V", {valueOf:_3}), '3 [object Object] 3');
		assert.equal(sprintf("%1$d %1$s %1$V", {valueOf:_3, toString:_f}), '3 f 3');
	});
	it('correctly handles standard integer conversions: diouxXDUO', function() {
		assert.equal(sprintf("%02hhx %02hhX", 1, 1234321), "01 91");
		assert.equal(sprintf("%02hhx %-02hhX", -1, -253), "ff 3 ");
		assert.equal(sprintf("%#02llx", -3), "0xfffffffffffffffd");
		assert.equal(sprintf("%#02llX", -3), "0XFFFFFFFFFFFFFFFD");
		assert.equal(sprintf("%#02llo", -3), "01777777777777777777775");
		assert.equal(sprintf("%#02llu", -3), "18446744073709551613");
		assert.equal(sprintf("%#03lld", -3), "-03");
		assert.equal(sprintf("%.9d %.9d", 123456, -123456), "000123456 -000123456");
	});
	it('correctly handles new binary conversions: bB', function() {
		assert.equal(sprintf("%#b", -3), "0b11111111111111111111111111111101");
		assert.equal(sprintf("%#5B", 3), " 0b11");
	});
	it('recognizes IEEE754 special values', function() {
		assert.equal(sprintf("%a", Infinity), "inf");
		assert.equal(sprintf("%e", -Infinity), "-inf");
		assert.equal(sprintf("%f", 0/0), "nan");
		assert.equal(sprintf("%g", 1/-Infinity), "-0");
	});
	it('correctly handles floating point conversions: aAeEfFgG', function() {
		assert.equal(sprintf("%1$g %1$#g", 1e5), "100000 100000.");
		assert.equal(sprintf("%.3g %.3g", 1.2345e-4, 1.2345e-5), "0.000123 1.23e-05");
		assert.equal(sprintf("%f", 1.23e22).replace("10486","00000"), "12300000000000000000000.000000");
		assert.equal(sprintf("|%1$4.1f|%1$04.1f|%1$-4.1f", 1.2), "| 1.2|01.2|1.2 ");
		assert.equal(sprintf("%1$.1a|%1$04.0f", -128), "-0x1.0p+7|-128");
		assert.equal(sprintf("%1$.1a|%1$04.0f", -6.9e-11), "-0x1.3p-34|-000");
		if(!isopera()) {
			assert.equal(sprintf("%a %A %a %A", 1, .2, .69, 6e20), "0x1p+0 0X1.999999999999AP-3 0x1.6147ae147ae14p-1 0X1.043561A88293P+69");
			assert.equal(sprintf("%La %LA %La %LA", 1, .2, .69, 6e20), "0x8p-3 0XC.CCCCCCCCCCCDP-6 0xb.0a3d70a3d70ap-4 0X8.21AB0D441498P+66");
			assert.equal(sprintf("%010.1a", 1.), "0x001.0p+0");
			assert.equal(sprintf("%.7a %.7a", 129, -129), "0x1.0200000p+7 -0x1.0200000p+7");
			assert.equal(sprintf("%.7a", -3.1), "-0x1.8cccccdp+1");
		}
	});
	it('consistently handles null and undefined', function() {
		assert.equal(sprintf("|%1$a|%1$A|%1$e|%1$E|%1$f|%1$F|%1$g|%1$G|", undefined), "|nan|NAN|nan|NAN|nan|NAN|nan|NAN|");
		assert.equal(sprintf("|%1$a|%1$A|%1$e|%1$E|%1$f|%1$F|%1$g|%1$G|", null), "|nan|NAN|nan|NAN|nan|NAN|nan|NAN|");
		assert.equal(sprintf("|%1$b|%1$B|%1$d|%1$D|%1$i|%1$o|%1$O|%1$u|%1$U|%1$x|%1$X|", undefined), "|0|0|0|0|0|0|0|0|0|0|0|");
		assert.equal(sprintf("|%1$b|%1$B|%1$d|%1$D|%1$i|%1$o|%1$O|%1$u|%1$U|%1$x|%1$X|", null), "|0|0|0|0|0|0|0|0|0|0|0|");
	});
	it('handles dynamic specifiers', function() {
		assert.equal(sprintf("|%5s|", "sheetjs"), "|sheetjs|");
		assert.equal(sprintf("|%*s|", 5, "sheetjs"), "|sheetjs|");
		assert.equal(sprintf("|%2$*1$s|", 5, "sheetjs", 10), "|sheetjs|");
		assert.equal(sprintf("|%10s|", "sheetjs"), "|   sheetjs|");
		assert.equal(sprintf("|%2$*3$s|", 5, "sheetjs", 10), "|   sheetjs|");
		assert.equal(sprintf("|%0*.*d|", 4, 2, 1), "|  01|");
		assert.equal(sprintf("|%1$0*3$.*2$d|", 1, 2, 4), "|  01|");
		assert.equal(sprintf("|%*.*d|",   4, 2, 1), "|  01|");
		assert.equal(sprintf("|%-*.*d|",  4, 2, 1), "|01  |");
		assert.equal(sprintf("|%*.*d|",  -4, 2, 1), "|01  |");
		assert.equal(sprintf("|%-*.*d|", -4, 2, 1), "|01  |");
		assert.equal(sprintf("|%*s|", 4, "sheetjs"), "|sheetjs|");
		assert.equal(sprintf("|%*.*s|", 4,  3, "sheetjs"), "| she|");
		assert.equal(sprintf("|%*.*s|", 4,  2, "sheetjs"), "|  sh|");
		assert.equal(sprintf("|%*.*s|", 4,  1, "sheetjs"), "|   s|");
		assert.equal(sprintf("|%*.*s|", 4,  0, "sheetjs"), "|    |");
		assert.equal(sprintf("|%*.*s|", 4, -1, "sheetjs"), "|sheetjs|");
	});
});
