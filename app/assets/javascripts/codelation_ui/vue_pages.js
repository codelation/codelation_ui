(function() {
  "use strict";

  App.register('component').enter(function() {
    App.vue.currentPage = new Vue({
      el: "body"
    })
  }).exit(function() {
    App.vue.currentPage = null;
  });
})();
