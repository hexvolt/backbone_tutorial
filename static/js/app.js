var ExampleView = Backbone.View.extend({
    // This is an example of basic view which contains:
    // - `el` (html element this view is bound to)
    // - template (will be rendered to the el)
    // - initialize (a method that will be called when a view get instantiated)
    // - render (a method that renders template with the data and
    //           inserts it into html)

    el: '#container',   // which element this view will work with
    template: _.template("<h3>Hello, <%= user %></h3>"),

    initialize: function(){     // get called automatically on instantiation
        this.render();
    },

    render: function(){
        this.$el.html(
            this.template({user: 'anonymous'})
        );
    }
});

var app = {};

// Model
app.TodoModel = Backbone.Model.extend({
    // Note that it is a class that represents the data model, not an instance
    defaults: {
        title: '',
        completed: false
    },
    toggle: function() {
        this.save({ completed: !this.get('completed')});
    }
});

// Collection
app.TodoListCollection = Backbone.Collection.extend({
    model: app.TodoModel,

    // normally here should be specified an URL of the backend data storage
    localStorage: new Store("backbone-todo"),

    completed: function() {
        return this.filter(function(item) {
            return item.get('completed');
        });
    },

    pending: function() {
        return this.without.apply(this, this.completed());
    }

});
app.collectionTodoList = new app.TodoListCollection();  // global instance of the collection


// View
app.TodoView = Backbone.View.extend({
    tagName: 'li',      // will be wrapped into <li>
    template: _.template(this.$('#item-template').html()),
    initialize: function() {
        //re-render element after each update
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));

        // assigning it here because input get added dynamically when rendering
        this.inputEdit = this.$('.edit');
        return this;
    },

    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close',
        'click .destroy': 'destroy',
        'click .toggle': 'toggle'
    },

    edit: function() {
        // show editing input and hide label
        this.$el.addClass('editing');
        this.inputEdit.focus();
    },

    toggle: function() {
        this.model.toggle();
    },

    close: function() {
        // save the changes in appropriate model and hide editing input
        var value = this.inputEdit.val().trim();

        if (value)
            this.model.save({title: value});

        this.$el.removeClass('editing');
    },

    destroy: function() {
        this.model.destroy();
    },

    updateOnEnter: function(e) {
        if (e.which == 13)
            this.close();
    }
});

app.AppView = Backbone.View.extend({

    el: '#todoapp',

    initialize: function() {
        this.elTodoList = this.$('#todo-list');
        this.input = this.$('#new-todo');
        // finally bind trigger in order to keep page updated with the models
        app.collectionTodoList.on('add', this.addOne, this);
        app.collectionTodoList.on('reset', this.addAll, this);
        // the last step - fetch all the existing data from the storage
        app.collectionTodoList.fetch();
    },

    events: {
        'keypress #new-todo': 'createTodoOnEnter'
    },

    // methods
    createTodoOnEnter: function(e) {
        // append a new model instance to the collection
        if ( e.which !== 13 || !this.input.val().trim() )
            return;

        app.collectionTodoList.create(this.getCleanedAttributes());
        this.input.val('');
    },

    addOne: function(modelTodo) {
        // render and add an existing model instance to the list
        var view = new app.TodoView({model: modelTodo});
        this.elTodoList.append(view.render().el);
    },

    addAll: function() {
        // re-render an entire list based on the current collection content
        this.elTodoList.html('');
        switch (window.filter) {
            case 'pending':
                _.each(app.collectionTodoList.pending(), this.addOne, this);
                break;

            case 'completed':
                _.each(app.collectionTodoList.completed(), this.addOne, this);
                break;

            default:
                app.collectionTodoList.each(this.addOne, this);
                break;
        }
    },

    getCleanedAttributes: function() {
        return {
          title: this.input.val().trim(),
          completed: false
        }
    }
});

// Router
app.Router = Backbone.Router.extend({
    routes: {
        '*filter': 'setFilter'
    },
    setFilter: function(params) {
        console.log('app.router.params = ' + params);
        window.filter = params ? params.trim() : '';
        // important to trigger reset *after* setting the window.filter,
        // since reset() starts a collection re-fetch and re-rendering
        app.collectionTodoList.trigger('reset');
    }
});

// main initialization
app.router = new app.Router();
app.appView = new app.AppView();

// better to call this after the main view initialization where all
// the events binding perform
Backbone.history.start();

