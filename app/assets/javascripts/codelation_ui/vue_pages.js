(function() {
  "use strict";

  App.register('component').enter(function() {
    App.vue.currentPage = new Vue({
      mixins: [App.vue.interfaces.contentFormatters],
      el: "body",
      methods: {
        numeral: numeral,
        moment: moment
      }
    })
  }).exit(function() {
    App.vue.currentPage = null;
  });
})();
