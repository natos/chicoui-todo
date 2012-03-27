(function todos(w) {

	'use strict';

	var $ = w.$, ch = w.ch;


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

		ch.utils.document.bind(ch.events.KEY.ENTER, function (x, event) { 
			event.stopPropagation();
			self.addNewTodo(event); 
		});

		self.addNewTodo = function(event) {

			var $target = $(event.target);

			if ( self.$input[0] === $target[0] ) {

				var value = $target.val();

				if (value) {

					todos.add(new Todo(value));

					self.updateCounter();

					$target.val('');
	
				}

			}

		};


		self.updateCounter = function() {

			$('#todo-count').html( todos.size() );

		};

	};

	TodoApp.clearCompleted = function() {};

	/*
	 * @class Todo
	 */

	var Todo = function(value) {

		this.value = value;

		this.completed = false;

		this.template = '<input type="checkbox"> %%value%%<span class="remove ch-ico-error">remove</span><div class="item-edit"><input type="text"></div>';

		this.$container = $('#todo-list');

		this.$el = $('<li class="todo-item"></li>');

		this.$container.append( this.$el );

		this.render();

		return this;

	}

	Todo.prototype.render = function() {

		var self = this;

		self.$el.html( this.template.replace("%%value%%", self.value) ).blink();

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

		self.$el.addClass('done');

		return self;

	}

	Todo.prototype.unmarkAsDone = function() {

		var self = this;

		self.completed = false;

		self.$el.removeClass('done');

		return self;

	}

	Todo.prototype.enterEditMode = function() {

		var self = this;

			self.$el.addClass('editing').find('.item-edit input').val( self.value ).focus();

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

			if ( !self.$el.find('.item-edit input').val() ) {
				return;
			}

			self.value = self.$el.find('.item-edit input').val(); 

			self.exitEditMode();

			self.render();

	}

	Todo.prototype.remove = function() {

		var self = this;

			self.$el.unbind('dblclick').detach();
	}

	// Start App
	new TodoApp();

}(window));