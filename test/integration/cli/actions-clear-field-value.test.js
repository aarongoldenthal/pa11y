'use strict';

const assert = require('proclaim');
const runPa11yCli = require('../helper/pa11y-cli');

// Note: we use the JSON reporter in here to make it easier
// to inspect the output issues. The regular CLI output is
// tested in the reporter tests
describe('CLI action "clear-field-value"', function() {
	let pa11yResponse;

	describe('when the field exists', function() {

		before(async function() {
			pa11yResponse = await runPa11yCli(`${global.mockWebsiteAddress}/actions-clear-field-value`, {
				arguments: [
					'--config', './mock/config/actions-clear-field-value.json',
					'--reporter', 'json'
				]
			});
		});

		// The test file ../mock/html/actions-clear-field-value.html which we test here has an a11y
		// error in the markup. When this action is performed the DOM is manupulated by JavaScript
		// to remove the offending element, hence no a11y errors is proof of this successful action
		it('clears the field value before running tests', function() {
			console.log('pa11yResponse');
			console.log(pa11yResponse);
			assert.isArray(pa11yResponse.json);
			assert.lengthEquals(pa11yResponse.json, 0);
		});

	});

	describe('when the field does not exist', function() {

		before(async function() {
			pa11yResponse = await runPa11yCli(`${global.mockWebsiteAddress}/errors`, {
				arguments: [
					'--config', './mock/config/actions-clear-field-value.json'
				]
			});
		});

		it('exits with a code of `1`', function() {
			assert.strictEqual(pa11yResponse.exitCode, 1);
		});

		it('outputs an error', function() {
			assert.match(pa11yResponse.output, /failed action/i);
			assert.match(pa11yResponse.output, /no element matching selector "#name-field"/i);
		});

	});

});
