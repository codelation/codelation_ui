(function() {
  "use strict";

  App.register('component').enter(function() {
    console.warn("Loaded Vue")
    console.warn(App.vue);

    App.vue.currentPage = new Vue({
      mixins: [App.vue.interfaces.contentFormatters],
      el: "body",
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
    App.vue.currentPage = null;
  });
})();
