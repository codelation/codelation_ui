(function() {
  "use strict";

  App.register('component').enter(function() {
    App.vue.currentPage = new Vue({
      mixin: [App.vue.interfaces.contentFormatters],
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
