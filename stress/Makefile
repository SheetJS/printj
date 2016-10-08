CPPFLAGS=-Wno-format -Wno-constant-conversion
FLAGS=-P -C -Wno-invalid-pp-token -Wno-format
NODEOPTS=--max_old_space_size=4096

.PHONY: all
all: stress stress.njs

.PHONY: tests
tests: tests.h

tests.h: generate_testcase.njs
	node generate_testcase.njs > tests.h

stress.h: generate_stress.njs
	node $< > $@

stress: stress.c stress.h tests.h
	gcc $(CPPFLAGS) -o $@ $<

stress.njs: stress.js stress.h tests.h
	cpp -DJAVASCRIPT $(FLAGS) $< > $@

.PHONY: test
test:
	./stress | bash ./fix.sh > t1
	node $(NODEOPTS) stress.njs | bash ./fix.sh > t2
	diff -q t1 t2

.PHONY: clean
clean:
	@rm -f stress stress.njs tests.h stress.h t1 t2
