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
    App.vue.root = null;
  });
})();
