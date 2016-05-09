MAKEFLAGS = -j1
PATH := ./node_modules/.bin:$(PATH)
SHELL := /bin/bash
args = $(filter-out $@, $(MAKECMDGOALS))

.PHONY: all lint test-only test build coverage publish rebuild release

all: build test

build:
	babel src -d dist $(args)

lint:
	eslint src

test-only:
	tape -r babel-register test/**/*.test.js | tap-spec

test: lint test-only

coverage:
	nyc make test && nyc report --reporter=text-lcov | coveralls

publish: all
	npm publish

rebuild:
	rm -rf node_modules/ dist/ .nyc_output/ npm-debug.log
	npm i
	make build

VERS ?= "patch"
TAG ?= "latest"

release:
	git checkout master
	git pull --rebase
	make build
	make test
	npm version $(VERS) -m "Release %s"
	npm publish --tag $(TAG)
	git push --follow-tags