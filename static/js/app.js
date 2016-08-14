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
app.Todo = Backbone.Model.extend({
    // Note that it is a class that represents the data model, not an instance
    defaults: {
        title: '',
        completes: false
    }
});

// Collection
app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    localStorage: new Store("backbone-todo")
    // normally here should be specified an URL of the backend data storage
});
app.todoList = new app.TodoList();  // global instance of the collection


// View
app.TodoView = Backbone.View.extend({
    tagName: 'li',      // will be wrapped into <li>
    template: _.template($('#item-template').html()),
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

app.AppView = Backbone.View.extend({

    el: '#todoapp',

    initialize: function() {

    },

    events: {

    },
    // methods

    createTodoOnEnter: function() {

    },

    addOne: function() {

    },

    addAll: function() {

    },

    getNewAttributes: function() {

    }
});

// instantiating view
app.appView = new app.AppView();