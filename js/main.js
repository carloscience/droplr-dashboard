var DR = DR || {}; // main app object
var JST = JST || {};

DR.data = {};

// configure backbone layouts
Backbone.Layout.configure({
  manage: true,

  // where are the HTML templates:
  prefix: "templates/",

  fetchTemplate: function(path) {
    console.log('fetch:', arguments);
    // Concatenate the file extension.
    path = path + ".html";

    // If cached, use the compiled template.
    if (JST[path]) {
      return JST[path];
    }

    // Put fetch into `async-mode`.
    var done = this.async();

    // Seek out the template asynchronously.
    $.get(path, function(contents) {
      done(_.template(contents));
    }, "text");
  }
});

/*JB.ThumbnailModel = Backbone.Model.extend({});
JB.thumbnailModel = new JB.ThumbnailModel();*/

// Backbone router for nav links
DR.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'index': 'index'
  },
  index: function() {
    console.log('got index');
    // render home page
    //JB.home.render();
    DR.leftNav.render();
    DR.topNav.render();
    DR.thumbnails.render();
  }

});

$(document).ready(function() {

  DR.Header = Backbone.Layout.extend({
    template: 'header', // load header template
    el: '#header',
    initialize: function() {
      console.log('header initialize');
      console.log(this.$el.html());
      this.render(); // render header
    }
  });

  DR.LeftNav = Backbone.Layout.extend({
    template: 'left_nav',
    el: '#left_nav',
    initialize: function(){
      console.log('left nav initialized');
    }
  });

  DR.TopNav = Backbone.Layout.extend({
    template: 'top_nav',
    el: '#main',
    initialize: function() {
      console.log('top nav initialized');
    }
  });

  DR.Thumbnails = Backbone.Layout.extend({
    template: 'thumbnails',
    el: '#thumbnails',
    initialize: function() {
      console.log('thumbnails el is ' + this.el);
      $.getJSON('data/thumbnails.json', function(data) {
        console.log(data);
        $.extend(DR.data, data);
        var val = 'thumbnails';
        model = data[val];
        DR.thumbnailView = new DR.ThumbnailView({data: model});
      });
      console.log('thumbnails initialized');
    }
  });

  DR.ThumbnailView = Backbone.Layout.extend({
    template: 'thumbnails',
    el: '#thumbnails',
    initialize: function() {
      this.render();
    }
  });

  // instantiate Layouts and Router
  DR.leftNav = new DR.LeftNav();
  DR.topNav = new DR.TopNav();
  DR.thumbnails = new DR.Thumbnails();
  DR.router = new DR.Router();
  DR.header = new DR.Header();

  // start router
  Backbone.history.start();
  
});