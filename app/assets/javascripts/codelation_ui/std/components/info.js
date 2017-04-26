(function() {
  "use strict";

  var template = '<div class="vue-info" :style="{\'font-size\': size + \'px\'}">\
                      <i class=\"fa fa-question vue-info-hint\"></i>\
                      <span class="vue-info-message" :class="[direction]">\
                        <slot></slot>\
                      </span>\
                    </div>';

  App.ui.components.std.info = Vue.extend({
    template: template,
    props: {
      'size': {
        default: '12'
      },
      'direction': {
        default: ''
      }
    }
  });
})();
