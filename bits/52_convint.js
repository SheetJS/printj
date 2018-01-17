			/* signed integer */
			case /*D*/  68: LONG;
			/* falls through */
			case /*d*/ 100:
			case /*i*/ 105: INT; SGN(true); break;

			/* unsigned integer */
			case /*U*/  85: LONG;
			/* falls through */
			case /*u*/ 117: INT; break;

			/* unsigned octal */
			case /*O*/  79: LONG;
			/* falls through */
			case /*o*/ 111: INT; RADIX(8); break;

			/* unsigned hex */
			case /*x*/ 120: INT; RADIX(-16); break;
			case /*X*/  88: INT; RADIX(16); break;

			/* unsigned binary (extension) */
			case /*B*/  66: LONG;
			/* falls through */
			case /*b*/  98: INT; RADIX(2); break;
