(function() {
  "use strict";

  App.register('component').enter(function() {

    Vue.component('vue-checkmark', {
      template: '<div :style="styles">\
      <svg class="vue-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">\
        <circle class="vue-checkmark-circle" cx="26" cy="26" r="25" fill="none" :stroke-width="stroke"/>\
        <path class="vue-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" :stroke-width="stroke"/>\
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
  });
})();
