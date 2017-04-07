(function() {
  "use strict";
  
  App.register('first').enter(function() {
    // Insert the customizable global interface
    if (App.vue.interfaces.custom === undefined) {
      App.vue.interfaces.custom = {
        methods: {}
      };
    }
    
    // All vue components inherit this.  Used to show the vue page after the js loads
    Vue.mixin({
      mixins: [App.vue.interfaces.contentFormatters, App.vue.interfaces.string, App.vue.interfaces.custom],
      methods: {
        _numeral: numeral,
        _moment: moment
      }
    });
  });

  App.register('last').enter(function() {
    console.warn("Loaded Vue")
    console.warn(App.vue);
    if (App.vue.root === null) {
      App.vue.root = new Vue({
        el: "body",
        components: App.vue.extend,
        data: function() {
          return {
            pageLoadedClass: "vue-page-loaded"
          }
        }
      });
    }
  }).exit(function() {
    App.vue.extend = {};
    App.vue.root = null;
  });
})();
