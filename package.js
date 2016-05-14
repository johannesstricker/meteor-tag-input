Package.describe({
  name: 'stricker:tag-input',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A very basic tag input field.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.use(['templating', 'underscore', 'reactive-var'], ['client']);
  api.addFiles(['lib/input.css', 'lib/input.html', 'lib/input.js'], ['client']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use(['templating', 'underscore', 'reactive-var'], 'client');
  api.use('tinytest');
  api.use('stricker:tag-input');
  api.addFiles('tests/tag-input-client-tests.js', 'client');
});
