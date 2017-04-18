(function() {
  "use strict";

  App.register('first').enter(function() {
    // All vue components inherit this.  Used to show the vue page after the js loads
    Vue.mixin({
      mixins: App.vue.config.main.includedInterfaces,
      components: App.vue.globalComponents
    });
  });

  App.register('last').enter(function() {
    
    // Outputs the vue object
    if (App.vue.config.main.showInterfaces) {
      console.warn("Loaded Vue")
      console.warn(App.vue);
    }

    if (App.vue.root === null && $(App.vue.config.main.rootComponentNode || 'body').length) {
      App.vue.root = new Vue({
        el: App.vue.config.main.rootComponentNode || 'body',
        components: App.vue.extend,
        data: function() {
          return {
            pageLoadedClass: "vue-page-loaded"
          }
        }
      });
    }
  }).exit(function() {
    // Destroy Root
    App.vue.root.$destroy();
    App.vue.root = null;
    
    // Reinit Extends
    App.vue.extend = {
      _info: 'Used to hold references to per page components and attach to the root component if you did not define one.'
    };
  });
})();
