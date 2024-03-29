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
MJSTARGET=$(LIB).mjs
FLOWTGTS=$(TARGET) $(AUXTARGETS)
CLOSURE=/usr/local/lib/node_modules/google-closure-compiler/compiler.jar
UGLIFY="./node_modules/@sheetjs/uglify-js/bin/uglifyjs"
JSCS=./node_modules/.bin/jscs
JSHINT=./node_modules/.bin/jshint
MOCHA=./node_modules/.bin/mocha
ESLINT=./node_modules/.bin/eslint
ALEX=./node_modules/.bin/alex
MDSPELL=./node_modules/.bin/mdspell

## Main Targets

.PHONY: all
all: $(TARGET) ## Build library and auxiliary scripts

.PHONY: lib
lib:
	OUTDIR=$(PWD)/lib make -C bits

$(FLOWTGTS): %.js : %.flow.js
	node -e 'process.stdout.write(require("fs").readFileSync("$<","utf8").replace(/^[ \t]*\/\*[:#][^*]*\*\/\s*(\n)?/gm,"").replace(/\/\*[:#][^*]*\*\//gm,""))' > $@

$(FLOWTARGET): $(DEPS) lib
	cp lib/$(REQS).js $(FLOWTARGET)
	cp lib/$(REQS).mjs $(MJSTARGET)

bits/01_version.js: package.json
	echo "$(ULIB).version = '"`grep version package.json | awk '{gsub(/[^0-9a-z\.-]/,"",$$2); print $$2}'`"';" > $@

.PHONY: clean
clean: clean-stress ## Remove targets and build artifacts
	@OUTDIR=$(PWD)/lib make -C bits clean
	rm -f $(TARGET) $(FLOWTARGET)

.PHONY: init
init: ## Initial setup for development
	npm i

.PHONY: dist
dist: $(TARGET) ## Prepare JS files for distribution
	cp $(TARGET) dist/
	cp LICENSE dist/
	$(UGLIFY) $(TARGET) -o dist/$(LIB).min.js --source-map dist/$(LIB).min.map --preamble "$$(head -n 1 bits/00_header.js)"
	misc/strip_sourcemap.sh dist/$(LIB).min.js

## Testing

.PHONY: test mocha
test mocha: test.js $(TARGET) ## Run test suite
	$(MOCHA) -R spec -t 20000

.PHONY: ctest
ctest: ## Build browser test (into ctest/ subdirectory)
	cp -f test.js ctest/test.js
	cp -f shim.js ctest/shim.js
	cp -f $(TARGET) ctest/

.PHONY: ctestserv
ctestserv: ## Start a test server on port 8000
	@cd ctest && python -mSimpleHTTPServer

.PHONY: stress
stress: ## Run stress tests
	@make -C stress clean
	@make -C stress
	@make -C stress test

.PHONY: clean-stress
clean-stress: ## Remove stress tests
	@make -C stress clean

## Code Checking

.PHONY: fullint
fullint: lint old-lint tslint mdlint ## Run all checks

.PHONY: lint
lint: $(TARGET) ## Run eslint checks
	@$(ESLINT) --ext .js,.njs,.json,.html,.htm $(TARGET) $(AUXTARGETS) $(CMDS) $(HTMLLINT) package.json
	if [ -e $(CLOSURE) ]; then java -jar $(CLOSURE) $(FLOWTARGET) --jscomp_warning=reportUnknownTypes >/dev/null; fi

.PHONY: old-lint
old-lint: $(TARGET) ## Run jshint and jscs checks
	@$(JSHINT) --show-non-errors $(TARGET) $(AUXTARGETS)
	@$(JSHINT) --show-non-errors $(CMDS)
	@$(JSHINT) --show-non-errors package.json
	@$(JSHINT) --show-non-errors --extract=always $(HTMLLINT)
	@$(JSCS) lib/*.js
	if [ -e $(CLOSURE) ]; then java -jar $(CLOSURE) $(FLOWTARGET) --jscomp_warning=reportUnknownTypes >/dev/null; fi

.PHONY: tslint
tslint: $(TARGET) ## Run typescript checks
	#@npm install dtslint typescript
	@npm run-script dtslint

.PHONY: flow
flow: lint ## Run flow checker
	@flow check --all --show-all-errors

.PHONY: cov
cov: misc/coverage.html ## Run coverage test

misc/coverage.html: $(TARGET) test.js
	$(MOCHA) --require blanket -R html-cov -t 20000 > $@

.PHONY: coveralls
coveralls: ## Coverage Test + Send to coveralls.io
	$(MOCHA) --require blanket --reporter mocha-lcov-reporter -t 20000 | node ./node_modules/coveralls/bin/coveralls.js

MDLINT=README.md
.PHONY: mdlint
mdlint: $(MDLINT) ## Check markdown documents
	$(ALEX) $^
	$(MDSPELL) -a -n -x -r --en-us $^

.PHONY: help
help:
	@grep -hE '(^[a-zA-Z_-][ a-zA-Z_-]*:.*?|^#[#*])' $(MAKEFILE_LIST) | bash misc/help.sh

#* To show a spinner, append "-spin" to any target e.g. cov-spin
%-spin:
	@make $* & bash misc/spin.sh $$!
