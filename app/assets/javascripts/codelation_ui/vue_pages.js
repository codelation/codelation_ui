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

    App.vue.root = new Vue({
      mixins: [App.vue.interfaces.contentFormatters, App.vue.interfaces.custom],
      el: "body",
      components: components,
      data: function() {
        return {
          pageLoadedClass: "vue-page-loaded"
        }
      },
      methods: {
        numeral: numeral,
        moment: moment
      }
    })
  }).exit(function() {
    App.vue.extend = {};
    App.vue.root = null;
  });
})();
