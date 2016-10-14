LIB=printj
REQS=loop_code
ADDONS=
AUXTARGETS=lib/loop_char.js lib/loop_code.js lib/index_char.js lib/index_code.js lib/regex.js
CMDS=bin/printj.njs
HTMLLINT=index.html

ULIB=$(shell echo $(LIB) | tr a-z A-Z)
DEPS=$(sort $(wildcard bits/*.js))
TARGET=$(LIB).js
FLOWTARGET=$(LIB).flow.js

## Main Targets

.PHONY: all
all: $(TARGET) ## Build library and auxiliary scripts

.PHONY: lib
lib:
	OUTDIR=$(PWD)/lib make -C bits

$(TARGET) $(AUXTARGETS): %.js : %.flow.js
	node -e 'process.stdout.write(require("fs").readFileSync("$<","utf8").replace(/^[ \t]*\/\*[:#][^*]*\*\/\s*(\n)?/gm,"").replace(/\/\*[:#][^*]*\*\//gm,""))' > $@

$(FLOWTARGET): $(DEPS) lib
	cp lib/$(REQS).js $(FLOWTARGET)

bits/01_version.js: package.json
	echo "PRINTJ.version = '"`grep version package.json | awk '{gsub(/[^0-9a-z\.-]/,"",$$2); print $$2}'`"';" > $@

.PHONY: clean
clean: clean-stress ## Remove targets and build artifacts
	@OUTDIR=$(PWD)/lib make -C bits clean
	rm -f $(TARGET) $(FLOWTARGET)

## Testing

.PHONY: test mocha
test mocha: test.js $(TARGET) ## Run test suite
	mocha -R spec -t 20000

.PHONY: ctest
ctest: ## Build browser test (into ctest/ subdirectory)
	cp -f test.js ctest/test.js
	cp -f shim.js ctest/shim.js
	cp -f $(TARGET) ctest/

.PHONY: ctestserv
ctestserv: ## Start a test server on port 8000
	@cd ctest && python -mSimpleHTTPServer

.PHONY: stress ## Run stress tests
stress:
	@make -C stress clean
	@make -C stress
	@make -C stress test

.PHONY: clean-stress
clean-stress: ## Remove stress tests
	@make -C stress clean

## Code Checking

.PHONY: lint
lint: $(TARGET) ## Run jshint and jscs checks
	@jshint --show-non-errors $(TARGET) $(AUXTARGETS)
	@jshint --show-non-errors $(CMDS)
	@jshint --show-non-errors package.json
	@jshint --show-non-errors --extract=always $(HTMLLINT)
	@jscs lib/*.js

.PHONY: flow
flow: lint ## Run flow checker
	@flow check --all --show-all-errors

.PHONY: cov
cov: misc/coverage.html ## Run coverage test

misc/coverage.html: $(TARGET) test.js
	mocha --require blanket -R html-cov -t 20000 > $@

.PHONY: coveralls
coveralls: ## Coverage Test + Send to coveralls.io
	mocha --require blanket --reporter mocha-lcov-reporter -t 20000 | node ./node_modules/coveralls/bin/coveralls.js

.PHONY: help
help:
	@grep -hE '(^[a-zA-Z_-][ a-zA-Z_-]*:.*?|^#[#*])' $(MAKEFILE_LIST) | bash misc/help.sh

#* To show a spinner, append "-spin" to any target e.g. cov-spin
%-spin:
	@make $* & bash misc/spin.sh $$!
