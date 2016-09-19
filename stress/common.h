#define SUFFIX(arg, suffix) arg ## suffix
#define PREFIX(arg, prefix) prefix ## arg
#ifdef JAVASCRIPT
#define INFINITY Infinity

#define CAST_U(x) x
#define CAST_LD(x) x
#define CAST_WSTR(x) x
#define CAST_CHAR(x) (typeof (x) == 'string' ? (x).charCodeAt(0) : x)
#define CAST_UCHAR(x) (typeof (x) == 'string' ? (x).charCodeAt(0) : x)
#define CAST_SHORT(x) x
#define CAST_USHORT(x) x
#define CAST_L(x) x
#define CAST_UL(x) x
#define CAST_LL(x) x
#define CAST_ULL(x) x
#define CAST_INTMAX_T(x) x
#define CAST_UINTMAX_T(x) x
#define CAST_SIZE_T(x) x
#define CAST_SSIZE_T(x) x
#define CAST_PTRDIFF_T(x) x
#define CAST_UINTPTR_T(x) x

#else

#define CAST_U(x)         SUFFIX(x, u)
#define CAST_LD(x)        SUFFIX(x, L)
#define CAST_WSTR(x)      PREFIX(x, L)
#define CAST_CHAR(x)      x
#define CAST_UCHAR(x)     (unsigned char)x
#define CAST_SHORT(x)     (short)x
#define CAST_USHORT(x)    (unsigned short)CAST_U(x)

#define CAST_L(x)         SUFFIX(x, l)
#define CAST_UL(x)        SUFFIX(x, ul)
#define CAST_LL(x)        SUFFIX(x, ll)
#define CAST_ULL(x)       SUFFIX(x, ull)
#define CAST_INTMAX_T(x)  (intmax_t)x
#define CAST_UINTMAX_T(x) (uintmax_t)x
#define CAST_SIZE_T(x)    (size_t)x
#define CAST_SSIZE_T(x)   (ssize_t)x
#define CAST_PTRDIFF_T(x) (ptrdiff_t)x
#define CAST_UINTPTR_T(x) (uintptr_t)x
#endif
