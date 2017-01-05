ifndef OUTDIR
	OUTDIR=$(PWD)/lib
endif

JSFILES=$(wildcard *.js)
LIBS=$(filter-out $(wildcard [0-9]*_*.js),$(wildcard *.js))

OUTLIBS=$(patsubst %,$(OUTDIR)/%,$(LIBS))

CPPFLAGS=-P -C -Wno-invalid-pp-token -fdollars-in-identifiers -nostdinc -Wundef -undef $(JSFLAGS)

.PHONY: lib
lib: init $(JSFILES)
	for i in $(LIBS); do cpp $(CPPFLAGS) $$i | awk 'BEGIN{last=-3} NF>0 {last=NR} last >= NR-1' > $(OUTDIR)/$$i; done

.PHONY: init
init: 30_ctypes.js

30_ctypes.js: 30_ctypes.njs
	node 30_ctypes.njs > 30_ctypes.js

.PHONY: clean
clean:
	rm $(OUTLIBS) 30_ctypes.js
