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

Tinytest.addAsync('The tagInput fields value is correct.', (test, done) => {
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

Tinytest.addAsync('The tagInput templates add- and remove-function work properly.', (test, done) => {
  const view = UI.render(Template.tagInput, document.body);

  Meteor.setTimeout(() => {
    const template = view.templateInstance();
    test.equal(template.tags.get().length, 0);
    template.addTag('TAG1');
    template.addTag('TAG2');
    test.equal(template.tags.get().length, 2);
    template.removeTag(0);
    test.equal(template.tags.get(), ['TAG2']);
    done();
  }, 500);
});

Tinytest.addAsync('Strict mode works properly.', (test, done) => {
  const view = UI.renderWithData(Template.tagInput, {
    suggestions: ['one', 'two', 'three'],
    strict: true,
  }, document.body);

  Meteor.setTimeout(() => {
    const template = view._domrange.members[0].view.templateInstance();
    test.equal(template.suggestions.get().length, 3);
    template.addTag('TAG1');
    test.equal(template.tags.get().length, 0);
    template.addTag('one');
    test.equal(template.tags.get().length, 1);
    done();
  }, 500);
});

Tinytest.addAsync('Allow duplicates works properly.', (test, done) => {
  const view = UI.renderWithData(Template.tagInput, {
    allowDuplicates: false,
  }, document.body);

  Meteor.setTimeout(() => {
    const template = view._domrange.members[0].view.templateInstance();
    template.addTag('TAG1');
    template.addTag('TAG1');
    test.equal(template.tags.get().length, 1);
    done();
  }, 500);
});

Tinytest.addAsync('Suggestions work properly', (test, done) => {
  const view = UI.renderWithData(Template.tagInput, {
    allowDuplicates: false,
    suggestions: ['one', 'two', 'three', 'four'],
    strict: true,
  }, document.body);

  Meteor.setTimeout(() => {
    const template = view._domrange.members[0].view.templateInstance();
    let $input = $('input[type=text]');
    $input.val('t');
    $input.trigger('input');
    Meteor.setTimeout(() => {
      test.equal(template.getSuggestions().length, 2);
      done();
    }, 500);
  }, 500);
});