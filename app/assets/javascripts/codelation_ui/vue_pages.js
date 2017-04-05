(function() {
  "use strict";

  App.register('last').enter(function() {
      
    // Insert the customizable global interface
    if (App.vue.interfaces.custom === undefined) {
      App.vue.interfaces.custom = {
        methods: {}
      };
    }
    
    var components = App.vue.extend;
    
    console.warn("Loaded Vue")
    console.warn(App.vue);

    // All vue components inherit this.  Used to show the vue page after the js loads
    Vue.mixin({
      mixins: [App.vue.interfaces.contentFormatters, App.vue.interfaces.custom],
      methods: {
        numeral: numeral,
        moment: moment
      }
    });
    
    App.vue.root = new Vue({
      el: "body",
      components: components,
      data: function() {
        return {
          pageLoadedClass: "vue-page-loaded"
        }
      }
    });
  }).exit(function() {
    App.vue.extend = {};
    App.vue.root = null;
  });
})();
