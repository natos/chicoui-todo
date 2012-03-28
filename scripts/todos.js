(function todos(w) {

	'use strict';

	var $ = w.$, ch = w.ch, app;


	/*
	 * @collection Todos
	 */
	var todos = new ch.list();

	/*
	 * @class TodoApp
	 */
	var TodoApp = function() {

		var self = this;

		self.$input = $('#new-todo');

		self.$input.countdown(140);

		self.todoCounter = $('#todo-count');

		self.clearCompleted = $('#clear-completed');

		self.clearCompleted.on('click', function(event) {

			self.clearCompletedHandler(event);

		});

		self.toggleAll = $('#toggle-all');

		self.toggleAll.on('change', function(event) {

			self.toggleAllHandler(event);

		});

		ch.utils.document.on(ch.events.KEY.ENTER, function(event) { 

			self.addNewTodo(event);

		});

		return self;

	};

	TodoApp.prototype.addNewTodo = function(event) {

		event.stopPropagation();

		var self = this;

		var value = self.$input.val();

		if (value !== "") {

			todos.add(new Todo(value));

			self.updateCounter();

			self.$input.val('');
	
		}
	};

	TodoApp.prototype.toggleAllHandler = function(event) {

		event.stopPropagation();

		var self = this;

		var action = self.toggleAll.attr('checked') ? 'markAsDone' : 'unmarkAsDone';

		$(todos.children).each(function(i, todo) { todo[action](); });

	};

	TodoApp.prototype.updateCounter = function() {

		var self = this;

		var itemsLeft = 0, itemsCompleted = 0;

		$(todos.children).each(function(i, todo) { 

			todo.completed ? itemsCompleted++ :	itemsLeft++;

		});

		self.todoCounter.html( itemsLeft + ' items left' );

		self.clearCompleted.html( 'Clear ' + itemsCompleted + ' completed items' );

	};

	TodoApp.prototype.clearCompletedHandler = function(event) {

		event.stopPropagation();

		var self = this;

		$(todos.children).each(function(i, todo) { 

			todo.completed && todo.remove();

		});

		self.updateCounter();

	};

	/*
	 * @class Todo
	 */

	var Todo = function(value) {

		var self = this;

		self.value = value;

		self.completed = false;

		self.template = '<input type="checkbox"> %%value%%<span class="remove ch-ico-error">remove</span><div class="item-edit"><input type="text"></div>';

		self.$container = $('#todo-list');

		self.$el = $('<li class="todo-item"></li>');

		self.$container.append( self.$el );

		self.render();

		return self;

	}

	Todo.prototype.render = function() {

		var self = this;

		self.$el.html( this.template.replace("%%value%%", self.value) ).blink();

		self.completed && self.markAsDone() || self.unmarkAsDone();

		self.addHandlers();

		return self;	
	}

	Todo.prototype.addHandlers = function() {

		var self = this;
			self.$el.bind('dblclick', function(){
				self.enterEditMode();
			});

		var checkbox = self.$el.find('input');
			checkbox.change(function(event) {

				event.stopPropagation();

				( checkbox.attr('checked') ) ? self.markAsDone() : self.unmarkAsDone();
			});

		var remove = self.$el.find('.remove');
			remove.one('click', function() {
				self.remove();
			});

		return self;
	}


	Todo.prototype.markAsDone = function() {

		var self = this;

		self.completed = true;

		self.$el.addClass('done').find('input[type=checkbox]').attr('checked','checked');

		app.updateCounter();

		return self;

	}

	Todo.prototype.unmarkAsDone = function() {

		var self = this;

		self.completed = false;

		self.$el.removeClass('done').find('input[type=checkbox]').removeAttr('checked');

		app.updateCounter();

		return self;

	}

	Todo.prototype.enterEditMode = function() {

		var self = this;

			self.$el.removeClass('done').addClass('editing')
				.find('.item-edit input').val( self.value ).focus()[0].select();

		ch.utils.document.bind(ch.events.KEY.ENTER, function (event) { 
			event.stopPropagation();
			self.save(event); 
		});

		ch.utils.document.one('click', function(event) {
			event.stopPropagation();
			self.save(event); 			
		});

		return self;

	}

	Todo.prototype.exitEditMode = function() {

		var self = this;

			self.$el.removeClass('editing');

		return self;

	}

	Todo.prototype.save = function(event) {

		var self = this;

		var value = self.$el.find('.item-edit input').val();

			if ( !value ) {
				return;
			}

			self.value = value; 

			self.exitEditMode();

			self.render();

	}

	Todo.prototype.remove = function() {

		var self = this;

			self.$el.unbind('dblclick').detach();

			todos.rem(this);

			app.updateCounter();

	}

	// Start App
	app = new TodoApp();

}(window));