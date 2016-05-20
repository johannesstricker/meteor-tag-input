import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';

Template.tagInput.onCreated(function onCreated() {
  const instance = this;
  instance.settings = _.defaults(instance.data ? instance.data : {}, {
    id: 'tag-input',
    name: 'tag-input',
    placeholder: 'Enter a tag...',
    tags: [],
    tagTemplate: 'defaultTag',
    suggestions: [],
    strict: false,
    allowDuplicates: false,
  });
  instance.tags = new ReactiveVar(instance.settings.tags);
  instance.input = new ReactiveVar('');
  instance.suggestions = new ReactiveVar([]);

  /** Returns the accumulated width of the containers children **/
  instance.getScrollWidth = () => {
    let width = 0;
    const children = instance.container.children();
    children.each(function sumWidth() {
      width += $(this).outerWidth(true);
    });
    return width;
  };

  /** Will be passed to the suggestions to be called when done. **/
  instance.setSuggestions = (suggestions) => {
    instance.suggestions.set(suggestions);
  };

  /** Scrolls the container all to the right **/
  instance.scrollRight = () => {
    instance.container.animate({
      scrollLeft: instance.getScrollWidth(),
    }, 0);
  };


  /** Remove tag at index **/
  instance.removeTag = (index) => {
    const tags = instance.tags.get();
    tags.splice(index, 1);
    instance.tags.set(tags);
    _.defer(() => {
      instance.hiddenInput.trigger('change');
    });
  };

  /** Add tag with name **/
  instance.addTag = (name) => {
    /* Return if name is empty. */
    const trimmedName = name.trim();
    if (trimmedName === '') {
      return false;
    }

    /* If strict mode: check if tag is found, return otherwise. */
    if (instance.settings.strict && _.indexOf(instance.suggestions.get(), trimmedName) === -1) {
      return false;
    }


    const tags = instance.tags.get();
    /* Returns if no duplicates allowed and tag was already inserted. */
    if (!instance.settings.allowDuplicates && _.indexOf(tags, name) !== -1) {
      return false;
    }

    /* Add the tag. */
    tags.push(name);
    instance.tags.set(tags);

    /* Clear input. */
    instance.textInput.val('');

    /* Scroll to input. */
    _.defer(() => {
      instance.scrollRight();
      instance.hiddenInput.trigger('change');
    });

    return true;
  };

  /** Updates the suggestions when the user input changes. **/
  instance.autorun(() => {
    const input = instance.input.get();
    /* Reset suggestions. */
    instance.suggestions.set([]);

    /* Update suggestions. */
    if (_.isFunction(instance.settings.suggestions)) {
      instance.settings.suggestions(input, instance.setSuggestions);
    } else if (_.isArray(instance.settings.suggestions)) {
      const matches = _.filter(instance.settings.suggestions, (suggestion) => {
        return suggestion.indexOf(input) > -1;
      });
      instance.setSuggestions(matches);
    }
  });
});

Template.tagInput.helpers({
  settings: () => {
    const instance = Template.instance();
    return instance.settings;
  },
  value: () => {
    const instance = Template.instance();
    return instance.tags.get().join(',');
  },
  tags: () => {
    const instance = Template.instance();
    return instance.tags.get();
  },
  placeholder: () => {
    const instance = Template.instance();
    return instance.tags.get().length === 0 && instance.settings.placeholder;
  },
  suggestions: () => {
    const instance = Template.instance();
    let tags = instance.tags.get();
    let suggestions = instance.suggestions.get();
    return _.filter(suggestions, function(suggestion) {
        return instance.settings.allowDuplicates || _.indexOf(tags, suggestion, false) <= 0;
    });
  },
  onClickCallback: () => {
    const instance = Template.instance();
    return instance.addTag;
  }
});


/** Returns the carets position inside the input field. **/
const getCaretPosition = (input) => {
  let caretPos = 0;
  if (document.selection) {
    input.focus();
    const selection = document.selection.createRange();
    selection.oveStart('character', -input.value.length);
    caretPos = selection.text.length;
  } else if (input.selectionStart || input.selectionStart === '0') {
    caretPos = input.selectionStart;
  }
  return (caretPos);
};

Template.tagInput.events({
  'keydown .js-keydown-input': (e, instance) => {
    /* Remove tag on backspace if caret at 0 */
    const KEY_BACKSPACE = 8;
    if (e.which === KEY_BACKSPACE && getCaretPosition(e.target) === 0) {
      const index = instance.tags.get().length - 1;
      instance.removeTag(index);
    }

    /* Add tag on return */
    const KEY_RETURN = 13;
    if (e.which === KEY_RETURN) {
      const input = $(e.target).val();
      instance.addTag(input);
    }

    /* Do the scrolling manually, since it won't work in FF */
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    if (e.which === KEY_LEFT && getCaretPosition(e.target) === 0) {
      e.preventDefault();
      instance.container.animate({
        scrollLeft: instance.container.scrollLeft() - 10,
      }, 0);
    } else if (e.which === KEY_RIGHT && getCaretPosition(e.target) === $(e.target).val().length) {
      e.preventDefault();
      instance.container.animate({
        scrollLeft: instance.container.scrollLeft() + 10,
      }, 0);
    }
  },
  /** Updates the suggestions. **/
  'input .js-change-input': (e, instance) => {
    const val = $(e.target).val();
    instance.input.set(val);
  },
  /** Scrolls to input on focus. **/
  'focus .js-focus-input, blur .js-focus-input': (e, instance) => {
    instance.scrollRight();
  },
  /** Scroll to input on blur. **/
  'click .js-click-tag': (e, instance) => {
    const index = $(e.currentTarget).attr('data-index');
    instance.removeTag(index);
  },
});

/** Returns the height of the scrollbar (if visible) of element. **/
const getScrollbarHeight = (element) => {
  return element[0].offsetHeight - element[0].clientHeight;
};

Template.tagInput.onRendered(function onRendered() {
  const instance = this;

  /* store DOM-nodes for later use */
  instance.outerContainer = instance.$('.str-tag-input');
  instance.container = instance.$('.str-tag-input > div > div');
  instance.textInput = $('input[type=text]', instance.container);
  instance.hiddenInput = $('input[type=hidden]', instance.container);

  /* set a negative margin to hide the scrollbar */
  instance.container.css('overflow-x', 'scroll');
  instance.container.css('margin-bottom', `${-getScrollbarHeight(instance.container)}px`);

  /* scroll the container to the right */
  instance.scrollRight();

  /* Fix the height of the container */
  instance.container.css('height', `${instance.container.height()}px`);
  instance.$('.str-tags-each.invisible').remove();
});


Template.typeahead.events({
  'click .js-click-typeahead': function clickTypeahead(e, instance) {
    e.preventDefault();
    instance.data.onClick(this);
  }
})