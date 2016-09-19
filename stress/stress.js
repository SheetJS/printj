#ifndef JAVASCRIPT
#define JAVASCRIPT
#endif
var sprintf = require("../");
var printf = function() {
	var o = sprintf.sprintf.apply(null, arguments);
	process.stdout.write(o);
}

function stress(
	i, u,
	d, ld,
	s, ws,
	hhi, hhu, hi, hu,
	li, lu, lli, llu,
	ji, ju, zi, zu, ti, tu
) {
#include "stress.h"
}

#include "common.h"

#include "tests.h"
