# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: .eslint-plugin-local\index.js
# Merge Date: 2026-05-07T19:21:56.320305
# ---

const glob = require('glob');
const path = require('path');

require('ts-node').register({ experimentalResolver: true, transpileOnly: true });

// Re-export all .ts files as rules
const rules = {};
glob.sync(`${__dirname}/*.ts`).forEach((file) => {
	rules[path.basename(file, '.ts')] = require(file);
});

exports.rules = rules;
