#include <wchar.h>
#include <stdint.h>
#include <string.h>
#include <stddef.h>
#include <math.h>

#include "common.h"

void stress(
	int i, unsigned int u,
	double d, long double ld,
	char *s, wchar_t *ws,
	signed char hhi, unsigned char hhu, short hi, unsigned short hu,
	long li, unsigned long lu, long long lli, unsigned long long llu,
	intmax_t ji, uintmax_t ju, size_t zi, ssize_t zu, ptrdiff_t ti, uintptr_t tu
) {
#include "stress.h"
}

int main() {
	#include "tests.h"
}
