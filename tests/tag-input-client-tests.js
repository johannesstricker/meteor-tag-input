// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from 'meteor/tinytest';
import { UI } from 'meteor/blaze';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

Tinytest.add('The tagInput Templates are available on the client.', (test) => {
  test.notEqual(typeof Template.tagInput, 'undefined');
  test.notEqual(typeof Template.tagInput, 'undefined');
});

Tinytest.addAsync('The tagInput Template renders the input field with the correct id and name.', (test, done) => {
  const id = 'some-id';
  const name = 'some-name';
  UI.renderWithData(Template.tagInput, {
    id,
    name,
  }, document.body);
  Meteor.setTimeout(() => {
    const $byId = $(`#${id}`);
    const $byName = $(`[name=${name}]`);
    test.equal($byId.length, 1);
    test.equal($byName.length, 1);
    done();
  }, 500);
});

Tinytest.addAsync('The tagInput Template renders all given tags.', (test, done) => {
  const tags = ['tag1', 'tag2', 'tag3'];
  UI.renderWithData(Template.tagInput, {
    tags,
  }, document.body);
  Meteor.setTimeout(() => {
    const $tags = $('.str-tag');
    test.equal($tags.length, tags.length);
    done();
  }, 500);
});

Tinytest.addAsync('The tagInput field\'s value is correct.', (test, done) => {
  const tags = ['tag1', 'tag2', 'tag3'];
  UI.renderWithData(Template.tagInput, {
    tags,
    id: 'tag-input',
  }, document.body);
  Meteor.setTimeout(() => {
    const value = $('#tag-input').val();
    test.equal(value, tags.join(','));
    done();
  }, 500);
});

// TODO: test that adding and removing TAGS work properly
