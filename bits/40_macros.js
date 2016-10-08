#define isnan isNaN
//#define PAD_(x,c) (x >= 0 ? new Array(((x)|0) + 1).join((c)) : "")
var padstr = {
	" ": "                                 ",
	"0": "000000000000000000000000000000000",
	"7": "777777777777777777777777777777777",
	"f": "fffffffffffffffffffffffffffffffff"
};
#define PAD_(x,c) (x >= 0 ? padstr[c].substr(0,x) : "")
#ifdef DO_NOT_INLINE
function pads(x/*:number*/, c/*:string*/)/*:string*/ { return PAD_(x,c); }
#define PADS(x,c) pads(x,c)
#else
#define PADS(x,c) PAD_(x,c)
#endif

#define PAD(x)    pad = PADS(x, " ")

#define PREC_STR(O, prec) if(prec >= 0) O = O.substr(0, prec);

#define WIDTH(O, width, flags) \
	if(width > O.length || -width > O.length) { \
		if((flags.indexOf("-") == -1 || width < 0) && flags.indexOf("0") != -1) { \
			pad = PADS(width - O.length, "0"); \
			O = pad + O; \
		} else { \
			PAD(width - O.length); \
			O = flags.indexOf("-") > -1 ? O + pad : pad + O; \
		} \
	}

#ifndef SIZEOF_WCHAR_T
#error SIZEOF_WCHAR_T must be 1, 2, or 4
#elif SIZEOF_WCHAR_T == 1 || SIZEOF_WCHAR_T == 2 || SIZEOF_WCHAR_T == 4
#define WCHAR_TO_STR(O,cc) { cc &= MASK_WCHAR_T; O = String.fromCharCode(cc); }
#else
#error SIZEOF_WCHAR_T must be 1, 2, or 4
#endif

#define CHAR_TO_STR(O,cc) cc &= MASK_CHAR; O = String.fromCharCode(cc);

#if SIZEOF_SIZE_T > 4 /* TODO: negative ptrs? */
#define CONV_SIZE_T(x) x = Math.abs(x);
#define SIZE_T_TO_HEX(n) n.toString(16)
#else
#define CONV_SIZE_T(x) x = (x>>>0);
#define SIZE_T_TO_HEX(n) n.toString(16)
#endif


#define IDX_POS 2
#define IDX_FLAGS 3
#define IDX_WIDTH 4
#define IDX_PREC 5
#define IDX_LEN 6
