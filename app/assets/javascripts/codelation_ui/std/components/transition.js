(function() {
  "use strict";

  var template = '<div v-if="pageTransitionFinished" :transition="transitionName"><slot></slot></div>';

  App.ui.components.std.transition = Vue.extend({
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
})();
