			/* JS has no concept of pointers so interpret the `l` key as an address */
			case /*p*/ 112:
				Vnum = typeof arg == "number" ? arg : arg ? Number(arg.l) : -1;
				if(isnan(Vnum)) Vnum = -1;
				if(alt) O = Vnum.toString(10);
				else {
					CONV_SIZE_T(Vnum)
					O = "0x" + SIZE_T_TO_HEX(Vnum).toLowerCase();
				}
				break;

			/* store length in the `len` key */
			case /*n*/ 110:
				if(arg) { arg.len = o.length; }
				//if(arg) { arg.len=0; for(var oo/*:number*/ = 0; oo < o.length; ++oo) arg.len += o[oo].length; }
				continue;

			/* process error */
			case /*m*/ 109:
				if(!(arg instanceof Error)) O = "Success";
				else if(arg.message) O = arg.message;
				else if(arg.errno) O = "Error number " + arg.errno;
				else O = "Error " + String(arg);
				break;

			/* JS-specific conversions (extension) */
			case /*J*/  74: O = (alt ? u_inspect : JSON.stringify)(arg); break;
			case /*V*/  86: O = arg == null ? "null" : String(arg.valueOf()); break;
			case /*T*/  84:
				if(alt) { /* from '[object %s]' extract %s */
					O = Object.prototype.toString.call(arg).substr(8);
					O = O.substr(0, O.length - 1);
				} else O = typeof arg;
				break;

			/* boolean (extension) */
			case /*Y*/  89:
			case /*y*/ 121:
				O = (arg) ? (alt ? "yes" : "true") : (alt ? "no" : "false");
				if(c == /*Y*/ 89) O = O.toUpperCase();
				PREC_STR(O, prec)
				WIDTH(O, width, flags)
				break;
