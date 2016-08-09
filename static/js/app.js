var AppView = Backbone.View.extend({

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

var appView = new AppView();