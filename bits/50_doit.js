#include "30_ctypes.js"
#include "40_macros.js"
#ifdef USE_ESM
var u_inspect/*:(o:any)=>string*/ = JSON.stringify;
#else
/*:: var util = require('util'); */
/*global process:true, util:true, require:true */
if(typeof process !== 'undefined' && !!process.versions && !!process.versions.node) util=require("util");
var u_inspect/*:(o:any)=>string*/ = (typeof util != 'undefined') ? util.inspect : JSON.stringify;
#endif

function doit(t/*:ParsedFmt*/, args/*:Array<any>*/)/*:string*/ {
	var o/*:Array<string>*/ = [];
	var argidx/*:number*/ = 0, idx/*:number*/ = 0;
	var Vnum/*:number*/ = 0;
	var pad/*:string*/ = "";
	for(var i/*:number*/ = 0; i < t.length; ++i) {
		var m/*:ParsedEntry*/ = t[i], c/*:number*/ = (m[0]/*:string*/).charCodeAt(0);
		/* m order: conv full param flags width prec length */

		if(c === /*L*/ 76) { o.push(m[1]); continue; }
		if(c === /*%*/ 37) { o.push("%"); continue; }

		var O/*:string*/ = "";
		var isnum/*:number*/ = 0, radix/*:number*/ = 10, bytes/*:number*/ = SIZEOF_INT, sign/*:boolean*/ = false;

		/* flags */
		var flags/*:string*/ = m[IDX_FLAGS]||"";
		var alt/*:boolean*/ = flags.indexOf("#") > -1;

		/* position */
		if(m[IDX_POS]) argidx = parseInt(m[IDX_POS])-1;
		/* %m special case */
		else if(c === /*m*/ 109 && !alt) { o.push("Success"); continue; }

#define GRAB_INT(NAME, IDX, DFL) \
		var NAME/*:number*/ = DFL; \
		if(m[IDX] != null && m[IDX].length > 0) { \
			if(m[IDX].charAt(0) !== '*') NAME = parseInt(m[IDX], 10); \
			else if(m[IDX].length === 1) NAME = args[idx++]; \
			else NAME = args[parseInt(m[IDX].substr(1), 10)-1]; \
		}

		/* grab width */
		GRAB_INT(width, IDX_WIDTH, 0)

		/* grab precision */
		GRAB_INT(prec, IDX_PREC, -1)

		/* position not specified */
		if(!m[IDX_POS]) argidx = idx++;

		/* grab argument */
		var arg/*:any*/ = args[argidx];

		/* grab length */
		var len/*:string*/ = m[IDX_LEN] || "";

#define INT isnum = -1
#define SGN(s) sign = s
#define LONG bytes = SIZEOF_LONG
#define RADIX(n) radix = (n)
#define NUM(n) isnum = (n)

		switch(c) {
			/* str cCsS */
#include "51_convstr.js"
			/* int diDuUoOxXbB */
#include "52_convint.js"
			/* flt fegFEGaA */
#include "53_convflt.js"
			/* misc pnmJVTyY */
#include "54_convmisc.js"
		}

		if(width < 0) { width = -width; flags += "-"; }

		if(isnum == -1) {
#include "60_integer.js"
		} else if(isnum > 0) {
#include "70_float.js"
		}

		o.push(O);
	}
	return o.join("");
}
