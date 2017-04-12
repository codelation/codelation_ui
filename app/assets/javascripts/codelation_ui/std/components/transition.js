(function() {
  "use strict";

  App.register('component').enter(function() {

    var template = '<div v-if="pageTransitionFinished" :transition="transitionName"><slot></slot></div>';

    Vue.component('vue-transition', {
      props: {
        transitionName: {
          type: String,
          default: "v-fade-up"
        }
      },
      template: template,
      data: function() {
        return {
          pageTransitionFinished: false
        }
      },
      ready: function() {
        var self = this;
        this.$nextTick(function() {
          self.pageTransitionFinished = true;
        });
      }
    });
  });
})();
