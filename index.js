#!/usr/bin/env node

// [--root root] module file …

const fs = require('fs');
const path = require('path');
const jsesc = require('jsesc');
const denodeify = require('denodeify');
const minimist = require('minimist');
const { take, drop, zip } = require('lodash')

const readFile = denodeify(fs.readFile)
const readFileString = file => readFile(file).then(buffer => buffer.toString())

const writePromise = (promise) => {
	promise.then(
		output => process.stdout.write(output),
		error => {
			process.stderr.write(error.stack)
			process.exit(1)
		}
	)
}

const generateString = (module, filesWithContents) => {
	const entries = filesWithContents
		.map(([ file, content ]) => (
			`$templateCache.put('${file}', '${jsesc(content)}');`
		))
	return [`angular.module('${module}').run($templateCache => {`]
		.concat(entries.map(entry => `\t${entry}`))
		.concat(`});`)
		.join(`\n`);
};

const generate = ({ root, files, module }) => {
	const relativeFiles = files.map(file => path.relative(root, file));
	return Promise.all(files.map(readFileString))
		.then(contents => zip(relativeFiles, contents))
		// .then(xs => xs.slice(1, 2))
		.then(filesWithContents => generateString(module, filesWithContents))
};

const argv = minimist(process.argv.slice(2));
const options = {
	root: argv.root !== undefined ? argv.root : '',
	module: take(argv._, 1),
	files: drop(argv._, 1),
};

writePromise(generate(options));
