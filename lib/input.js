Template.tagInput.onCreated(function() {
	var instance = this;	
	instance.settings = _.defaults(instance.data ? instance.data : {}, {
		id: 'tag-input',
		name: 'tag-input',
		placeholder: 'Enter a tag...',
		tags: [],
		tagTemplate: 'defaultTag',
	});
	instance.tags = new ReactiveVar(instance.settings.tags);

	/** Returns the accumulated width of the containers children **/
	instance.getScrollWidth = function() {
		let width = 0;
		let children = instance.container.children();
		children.each(function() {
			width += $(this).outerWidth(true);
		});
		return width;
	}

	/** Scrolls the container all to the right **/
	instance.scrollRight = function() {
		instance.container.animate({scrollLeft: instance.getScrollWidth()}, 0);
	};

	/** Remove tag at index **/
	instance.removeTag = function(index) {
		let tags = instance.tags.get();
		tags.splice(index, 1);
		instance.tags.set(tags);
		_.defer(function() {
			instance.hiddenInput.trigger('change');
		});
	};

	/** Add tag with name **/
	instance.addTag = function(name) {
		name = name.trim();
		if(name === '')
			return;

		let tags = instance.tags.get();
		tags.push(name);
		instance.tags.set(tags);
		_.defer(function() { 
			instance.scrollRight();
			instance.hiddenInput.trigger('change');
		});
	};
});

Template.tagInput.helpers({
	settings: function() {
		const instance = Template.instance();
		return instance.settings;
	},
	value: function() {
		const instance = Template.instance();
		return instance.tags.get().join(',');
	},
	tags: function() {
		const instance = Template.instance();
		return instance.tags.get();
	},
	placeholder: function() {
		const instance = Template.instance();
		return instance.tags.get().length === 0 && instance.settings.placeholder;
	}
});


/** Returns the carets position inside the input field. **/
var getCaretPosition = function(input) {
    var caretPos = 0;
    if(document.selection) {
    	input.focus();
    	let selection = document.selection.createRange();
    	selection.moveStart('character', -input.value.length);
    	caretPost = selection.text.length;
    }
    // Firefox support
    else if (input.selectionStart || input.selectionStart == '0') {
    	caretPost = input.selectionStart;
    }
    return (caretPost);
}

Template.tagInput.events({
	'keydown .js-keydown-input': function(e, instance) {
		/* Remove tag on backspace if caret at 0 */
		let KEY_BACKSPACE = 8;
		if(e.which === KEY_BACKSPACE && getCaretPosition(e.target) === 0) {
			let index = instance.tags.get().length - 1;
			instance.removeTag(index);
		}

		/* Add tag on return */
		let KEY_RETURN = 13;
		if(e.which === KEY_RETURN) {
			let input = $(e.target).val();
			instance.addTag(input);
			$(e.target).val('');		
		}

		/* Do the scrolling manually, since it won't work in FF */
		let KEY_LEFT = 37;
		let KEY_RIGHT = 39;
		if(e.which === KEY_LEFT && getCaretPosition(e.target) === 0) {
			e.preventDefault();
			instance.container.animate({scrollLeft: instance.container.scrollLeft() - 10}, 0);
		} else if (e.which === KEY_RIGHT && getCaretPosition(e.target) === $(e.target).val().length) {
			e.preventDefault();
			instance.container.animate({scrollLeft: instance.container.scrollLeft() + 10}, 0);
		}
	},
	/** Scrolls to input on focus. **/
	'focus .js-focus-input, blur .js-focus-input': function(e, instance) {
		instance.scrollRight();
	},
	/** Scroll to input on blur. **/
	'click .js-click-tag': function(e, instance) {
		let index = $(e.currentTarget).attr("data-index");
		instance.removeTag(index);
	}
});

/** Returns the height of the scrollbar (if visible) of element. **/
var getScrollbarHeight = function(element) {
	return element[0].offsetHeight - element[0].clientHeight;
}

Template.tagInput.onRendered(function() {
	const instance = this;

	/* store DOM-nodes for later use */
	instance.outerContainer = instance.$('.str-tag-input');
	instance.container = instance.$('.str-tag-input > div');
	instance.hiddenInput = $('input[type=hidden]', instance.container);

	/* set a negative margin to hide the scrollbar */
	instance.container.css('overflow-x', 'scroll');
	instance.container.css('margin-bottom', -getScrollbarHeight(instance.container) + 'px');

	/* scroll the container to the right */
	instance.scrollRight();

	/* Fix the height of the container */
	instance.container.css('height', instance.container.height() + 'px');
	instance.$('.str-tags-each.invisible').remove();
});