var assert = require("assert");

var IMPL = require("./lib/impl.json");
var COMPARE = require("./tests/compare.json");
var PRINTF = require("./tests/printf");

var IMPLS = {}, IMPLA = [];
IMPL.forEach(function(impl, i) { IMPLS[impl] = IMPLA[i] = require("./lib/" + impl); });
IMPL.push("base"); IMPLS["base"] = IMPLA[IMPL.length-1] = require("./");

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

describe('consensus', function() {
	it('tokenizer', function() {
		COMPARE.forEach(function(m) {
			var base = IMPLA[0]._tokenize(m);
			for(var i = 1; i < IMPLA.length; ++i) compare_parse(base, IMPLA[i]._tokenize(m));
		});
	});
});

describe('correctness', function() {
	IMPL.forEach(function(n,i) {
		it(n, function() {
			PRINTF.forEach(function(v) {
				assert.equal(IMPLA[i].sprintf.apply(IMPLA[i], v[0]), v[1]);
			});
		});
	});
});
