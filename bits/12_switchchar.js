		if(C >= "0" && C <= "9")	{
				if(fmtprec.length) fmtprec += C;
				else if(C == "0" && !fmtwidth.length) fmtflags += C;
				else fmtwidth += C;
		} else switch(C) {
			/* positional */
			case '$':
				if(fmtprec.length) fmtprec += "$";
				else if(fmtwidth.charAt(0) == "*") fmtwidth += "$";
				else { fmtparam = fmtwidth + "$"; fmtwidth = ""; }
				break;

			/* flags */
			case "'": fmtflags += "'"; break;
			case '-': fmtflags += "-"; break;
			case '+': fmtflags += "+"; break;
			case ' ': fmtflags += " "; break;
			case '#': fmtflags += "#"; break;

			/* width and precision */
			case '.': fmtprec = "."; break;
			case '*':
				if(fmtprec.charAt(0) == ".") fmtprec += "*";
				else fmtwidth += "*";
				break;

			/* length */
			case 'h':
			case 'l':
				if(fmtlen !== "" && fmtlen !== C) throw "bad length " + fmtlen + C;
				fmtlen += C;
				break;

			case 'L':
			case 'j':
			case 'z':
			case 't':
			case 'q':
			case 'Z':
			case 'w':
				if(fmtlen !== "") throw "bad length " + fmtlen + C;
				fmtlen = C;
				break;

			case 'I':
				if(fmtlen !== "") throw "bad length " + fmtlen + 'I';
				fmtlen = 'I';
				break;

			/* conversion */
			case 'd':
			case 'i':
			case 'o':
			case 'u':
			case 'x':
			case 'X':
			case 'f':
			case 'F':
			case 'e':
			case 'E':
			case 'g':
			case 'G':
			case 'a':
			case 'A':
			case 'c':
			case 'C':
			case 's':
			case 'S':
			case 'p':
			case 'n':
			case 'D':
			case 'U':
			case 'O':
			case 'm':
			case 'b':
			case 'B':
			case 'y':
			case 'Y':
			case 'J':
			case 'V':
			case 'T':
			case '%':
				infmt = false;
				if(fmtprec.length > 1) fmtprec = fmtprec.substr(1);
				out.push([C, fmt.substring(start, i+1), fmtparam, fmtflags, fmtwidth, fmtprec, fmtlen]);
				start = i+1;
				fmtlen = fmtprec = fmtwidth = fmtflags = fmtparam = "";
				break;
			default:
				throw new Error("Invalid format string starting with |" + fmt.substring(start, i+1) + "|");
		}
