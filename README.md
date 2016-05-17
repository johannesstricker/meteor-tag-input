# TagInput

_stricker:tag-input_

A very-easy-to-use tag input field, that supports scrolling when the contents expand the input field. It allows the user to insert arbitrary tags. Typeahead is not yet supported, but will be added in the future.

## Installation

    meteor add stricker:tag-input

## Basic Usage

Simply insert the tagInput template to use it with default settings.

```javascript
{{> tagInput}}
```

The inserted tags can be obtained from the value field of the hidden input.

```javascript
let value = $('#tag-input').val();  // ['TAG1', 'TAG2', ..]
```

## Settings

You can specify settings by passing an object to the template's data context. Below are the default settings.

```javascript
Template.form.helpers({
    settings: function() {
        return {
            id: 'tag-input',  // the id of the input field that contains the value
            name: 'tag-input',  // the name of the input field that contains the value
            placeholder: 'Enter a tag...',  // a placeholder text
            tags: [],  // preset list of tags e.g. ['TAG1', 'TAG2']
            tagTemplate: 'defaultTag',  // a custom tag Template, expects the tag name as it's data context
            suggestions: [],  // pass an array or a callback function(input, callback)
            strict: false,  // in strict mode, only insertion of suggested tags is allowed
            allowDuplicates: false  // allow multiple insertions of the same tag
        };
    }
});
```

```html
<template name="form">
    <form>
        {{> tagInput settings}}
        <input type="submit" value="Submit">
    </form>
</template>
```

## License
MIT
