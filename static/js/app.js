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
        completes: false
    }
});

// Collection
app.TodoListCollection = Backbone.Collection.extend({
    model: app.TodoModel,
    localStorage: new Store("backbone-todo")
    // normally here should be specified an URL of the backend data storage
});
app.collectionTodoList = new app.TodoListCollection();  // global instance of the collection


// View
app.TodoView = Backbone.View.extend({
    tagName: 'li',      // will be wrapped into <li>
    template: _.template(this.$('#item-template').html()),
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
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
        app.collectionTodoList.each(this.addOne, this);
    },

    getCleanedAttributes: function() {
        return {
          title: this.input.val().trim(),
          completed: false
        }
    }
});

// instantiating view
app.appView = new app.AppView();