(function() {
  "use strict";

  App.ui.components.extended.fail = Vue.extend({
    template: '<div :style="styles">\
    <svg class="vue-fail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">\
      <circle class="vue-fail-circle" cx="26" cy="26" r="25" fill="none" :stroke-width="stroke"/>\
      <path class="vue-fail-check" fill="none" d="M16 16 36 36 M36 16 16 36" :stroke-width="stroke"/>\
    </svg></div>\
    ',
    props: {
      size: {
        type: Number,
        default: 50
      },
      stroke: {
        type: Number,
        default: 3.5
      }
    },
    computed: {
      styles: function() {
        var newSize = this.size + 'px';
        return {
          width: newSize,
          height: newSize
        };
      }
    }
  });
})();
