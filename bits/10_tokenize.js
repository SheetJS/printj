#ifdef USE_CHAR
#define GETCHAR C = fmt.charAt(i);
#else
#define GETCHAR c = fmt.charCodeAt(i);
#endif

var tcache = {};

#define DRAIN(idx) if(start < idx) out.push(["L", fmt.substring(start, idx)]);
function tokenize(fmt/*:string*/)/*:ParsedFmt*/ {
	if(tcache[fmt]) return tcache[fmt];
	var out/*:ParsedFmt*/ = [];
	var start/*:number*/ = 0;

#ifdef USE_REGEX

	var m/*:?Array<string>*/;
	while((m = REGEX.exec(fmt))) {
		DRAIN(m.index)
		start = m.index + m[0].length;
		if(m[0] === "%%") out.push(["%","%"]);
		else out.push([m[6], m[0]||"", m[1]||"", m[2]||"", m[3]||"", m[4]||"", m[5]||""]);
	}

#else /* NOT USE_REGEX */

	var i/*:number*/ = 0;
	var infmt/*:boolean*/ = false;
	var fmtparam/*:string*/ = "", fmtflags/*:string*/ = "", fmtwidth/*:string*/ = "", fmtprec/*:string*/ = "", fmtlen/*:string*/ = "";

#if defined(USE_CHAR)
	var C/*:string*/ = '?';
#else /* USE_CODE */
	var c/*:number*/ = 0;
#endif /* USE_CHAR */

#if defined(USE_INDEX)
	while((i=fmt.indexOf("%", start)) != -1) {
		DRAIN(i)
		start = i++;
		infmt = true;
		while(infmt) {
			GETCHAR
#ifdef USE_CHAR
#include "12_switchchar.js"
#else /* USE_CODE */
#include "11_switchcode.js"
#endif /* USE_CHAR */
			++i;
		}
	}
#elif defined(USE_LOOP)

	var L/*:number*/ = fmt.length;

	for(; i < L; ++i) {
		GETCHAR
		if(!infmt) {
#ifdef USE_CHAR
			if(C !== "%") continue;
#else /* USE_CODE */
			if(c !== 37) continue;
#endif /* USE_CHAR */
			DRAIN(i)
			start = i;
			infmt = true;
			continue;
		}
#ifdef USE_CHAR
#include "12_switchchar.js"
#else /* USE_CODE */
#include "11_switchcode.js"
#endif /* USE_CHAR */
	}
#endif /* USE_INDEX / USE_LOOP */

#endif /* USE_REGEX */

	if(start < fmt.length) out.push(["L", fmt.substring(start)]);
	return (tcache[fmt] = out);
}
