			Vnum = Number(arg);

			/* parse byte length field */
#include "55_bytelen.js"

			/* restrict value */
#define _DOIT(msk, max) Vnum = (Vnum & msk); if(sign && (Vnum > max)) Vnum -= (msk + 1)
			switch(bytes) {
				case 1: _DOIT(0xFF, 0x7F); break;
				case 2: _DOIT(0xFFFF, 0x7FFF); break;
				case 4: Vnum = sign ? (Vnum | 0) : (Vnum >>> 0); break;
				default: Vnum = isnan(Vnum) ? 0 : Math.round(Vnum); break;
			}
#undef _DOIT

			/* generate string */
			if(bytes > 4 && Vnum < 0 && !sign) {
				if(radix == 16 || radix == -16) {
					O = (Vnum>>>0).toString(16);
					Vnum = Math.floor((Vnum - (Vnum >>> 0)) / Math.pow(2,32));
					O = (Vnum>>>0).toString(16) + PADS(8 - O.length, "0") + O;
					O = PADS(16 - O.length, "f") + O;
					if(radix == 16) O = O.toUpperCase();
				} else if(radix == 8) {
					O = (Vnum>>>0).toString(8);
					O = PADS(10 - O.length, "0") + O;
					Vnum = Math.floor((Vnum - ((Vnum >>> 0)&0x3FFFFFFF)) / Math.pow(2,30));
					O = (Vnum>>>0).toString(8) + O.substr(O.length - 10);
					O = O.substr(O.length - 20);
					O = "1" + PADS(21 - O.length, "7") + O;
				} else {
					Vnum = (-Vnum) % 1e16;
					var d1/*:Array<number>*/ = [1,8,4,4,6,7,4,4,0,7,3,7,0,9,5,5,1,6,1,6];
					var di = d1.length - 1;
					while(Vnum > 0) {
						if((d1[di] -= (Vnum % 10)) < 0) { d1[di] += 10; d1[di-1]--; }
						--di; Vnum = Math.floor(Vnum / 10);
					}
					O = d1.join("");
				}
			} else {
				if(radix === -16) O = Vnum.toString(16).toLowerCase();
				else if(radix === 16) O = Vnum.toString(16).toUpperCase();
				else O = Vnum.toString(radix);
			}

			/* apply precision */
			if(prec ===0 && O == "0" && !(radix == 8 && alt)) O = ""; /* bail out */
			else {
				if(O.length < prec + (O.substr(0,1) == "-" ? 1 : 0)) {
					if(O.substr(0,1) != "-") O = PADS(prec - O.length, "0") + O;
					else O = O.substr(0,1) + PADS(prec + 1 - O.length, "0") + O.substr(1);
				}

				/* add prefix for # form */
				if(!sign && alt && Vnum !== 0) switch(radix) {
					case -16: O = "0x" + O; break;
					case  16: O = "0X" + O; break;
					case   8: if(O.charAt(0) != "0") O =  "0" + O; break;
					case   2: O = "0b" + O; break;
				}
			}

			/* add sign character */
			if(sign && O.charAt(0) != "-") {
				if(flags.indexOf("+") > -1) O = "+" + O;
				else if(flags.indexOf(" ") > -1) O = " " + O;
			}
			/* width */
			if(width > 0) {
				if(O.length < width) {
					if(flags.indexOf("-") > -1) {
						O = O + PADS((width - O.length), " ");
					} else if(flags.indexOf("0") > -1 && prec < 0 && O.length > 0) {
						if(prec > O.length) O = PADS((prec - O.length), "0") + O;
						pad = PADS((width - O.length), (prec > 0 ? " " : "0"));
						if(O.charCodeAt(0) < 48) {
							if(O.charAt(2).toLowerCase() == "x") O = O.substr(0,3) + pad + O.substring(3);
							else O = O.substr(0,1) + pad + O.substring(1);
						}
						else if(O.charAt(1).toLowerCase() == "x") O = O.substr(0,2) + pad + O.substring(2);
						else O = pad + O;
					} else {
						O = PADS((width - O.length), " ") + O;
					}
				}
			}
