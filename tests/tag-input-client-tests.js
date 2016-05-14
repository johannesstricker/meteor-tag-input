// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

Tinytest.add('The tagInput Templates are available on the client.', function(test) {
	test.notEqual(typeof Template.tagInput, "undefined");
	test.notEqual(typeof Template.tagInput, "undefined");
});

Tinytest.addAsync('The tagInput Template renders the input field with the correct id and name.', function(test, done) {
	let id = 'some-id';
	let name = 'some-name';
	UI.renderWithData(Template.tagInput, {id: id, name: name}, document.body);
	Meteor.setTimeout(function() {
		let $byId = $('#' + id);
		let $byName = $('[name=' + name + ']');
		test.equal($byId.length, 1);
		test.equal($byName.length, 1);
		done();
	}, 500);
});

Tinytest.addAsync('The tagInput Template renders all given tags.', function(test, done) {
	let tags = ['tag1', 'tag2', 'tag3'];
	UI.renderWithData(Template.tagInput, {tags: tags}, document.body);
	Meteor.setTimeout(function() {
		let $tags = $('.str-tag');
		test.equal($tags.length, tags.length);
		done();
	}, 500);
});

Tinytest.addAsync('The tagInput field\'s value is correct.', function(test, done) {
	let tags = ['tag1', 'tag2', 'tag3'];
	UI.renderWithData(Template.tagInput, {tags: tags, id: 'tag-input'}, document.body);
	Meteor.setTimeout(function() {
		let value = $('#tag-input').val();
		test.equal(value, tags.join(','));
		done();
	}, 500);
});

// TODO: test that adding and removing TAGS work properly