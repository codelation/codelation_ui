(function() {
  "use strict";

  App.register('first').enter(function() {

    App.ui.config.csrf_token = $('head meta[name="csrf-token"]').first().attr('content') || null;

    // All vue components inherit this.  Used to show the vue page after the js loads
    Vue.mixin({
      mixins: App.ui.config.main.includedInterfaces,
      components: App.ui.globalComponents
    });
  });

  App.register('last').enter(function() {

    // Outputs the vue object
    if (App.ui.config.main.showInterfaces) {
      console.warn("Loaded Vue")
      console.warn(App.ui);
    }

    if (App.ui.root === null && $(App.ui.config.main.rootComponentNode || 'body').length) {
      App.ui.root = new Vue({
        el: App.ui.config.main.rootComponentNode || 'body',
        components: App.ui.extend,
        data: function() {
          return {
            pageLoadedClass: "vue-page-loaded"
          }
        }
      });
    }

    if (App.ui.root.$el === null) {
      App.ui.root.$el = App.ui.config.main.rootComponentNode;
    }
  }).exit(function() {
    // Destroy Root
    App.ui.root.$destroy();
    App.ui.root = null;

    // Reinit Extends
    App.ui.extend = {
      _info: 'Used to hold references to per page components and attach to the root component if you did not define one.'
    };
  });
})();
