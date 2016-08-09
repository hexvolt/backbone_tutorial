var AppView = Backbone.View.extend({
    // This is a basic view which contains:
    // - `el` (html element this view is bound to)
    // - template (will be rendered to the el)
    // - initialize (a method that will be called when a view get instantiated)
    // - render (a method that renders template with the data and
    //           inserts it into html)

    el: '#container',
    template: _.template("<h3>Hello, <%= user %></h3>"),

    initialize: function(){
        this.render();
    },

    render: function(){
        this.$el.html(
            this.template({user: 'anonymous'})
        );
    }
});

// Model
var app = {};
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


// instantiating view
var appView = new AppView();