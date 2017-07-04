			case /*S*/  83:
			case /*s*/ 115:
				/* only valid flag is "-" for left justification */
				O = String(arg);
				PREC_STR(O, prec)
				WIDTH(O, width, flags)
				break;

			/* first char of string or convert */
			case /*C*/  67:
			case /*c*/  99:
				switch(typeof arg) {
					case "number":
						var cc/*:number*/ = arg;
						if(c == 67 || len.charCodeAt(0) === /*l*/ 108) WCHAR_TO_STR(O, cc)
						else CHAR_TO_STR(O, cc)
						break;
					case "string": O = /*::(*/arg/*:: :string)*/.charAt(0); break;
					default: O = String(arg).charAt(0);
				}
				WIDTH(O, width, flags)
				break;
