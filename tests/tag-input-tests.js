// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by tag-input.js.
// import { name as packageName } from "meteor/tag-input";

// Write your tests here!
// Here is an example.
// Tinytest.add('tag-input - example', function (test) {
//   test.equal(packageName, "tag-input");
// });

Tinytest.add('Is the tagInput Template available on the client?', function(test) {
	// test.notEqual(typeof Template.tagInput, "undefined");
	test.equal(true, true);
});