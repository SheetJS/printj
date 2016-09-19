#define SETBYTES(n) { bytes = n; }
#define SETBYTESC(n) { if(bytes == SIZEOF_INT) bytes = n; }
			switch(len) {
				/* char */
				case "hh": SETBYTES(SIZEOF_CHAR) break;
				/* short */
				case "h":  SETBYTES(SIZEOF_SHORT) break;

				/* long */
				case "l":  SETBYTESC(SIZEOF_LONG) break;

				/* long long */
				case "L":
				case "q":
				case "ll": SETBYTESC(SIZEOF_LONG_LONG) break;

				/* intmax_t */
				case "j":  SETBYTESC(SIZEOF_INTMAX_T) break;

				/* ptrdiff_t */
				case "t":  SETBYTESC(SIZEOF_PTRDIFF_T) break;

				/* size_t */
				case "z":
				case "Z":  SETBYTESC(SIZEOF_SIZE_T) break;

				/* CRT size_t or ptrdiff_t */
				case "I":
#if SIZEOF_PTRDIFF_T == SIZEOF_SIZE_T
					SETBYTESC(SIZEOF_SIZE_T)
#else
					if(sign) SETBYTESC(SIZEOF_PTRDIFF_T)
					else SETBYTESC(SIZEOF_SIZE_T)
#endif
					break;

				/* CRT wchar_t */
				case "w": break;
			}
