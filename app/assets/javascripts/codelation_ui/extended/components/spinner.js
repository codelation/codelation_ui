(function() {
  "use strict";

  App.ui.components.extended.spinner = Vue.extend({
    template: ' <div class="vue-spinner" :class="classes" :style="styles">\
                  <svg class="vue-spinner-draw" viewBox="25 25 50 50" v-if="spinning">\
                    <circle class="vue-spinner-path" cx="50" cy="50" r="20" :stroke-width="stroke" :stroke-dasharray="dashProgress">\
                  </svg>\
                  <vue-checkmark v-if="success" :stroke="stroke" :size="size"></vue-checkmark>\
                  <vue-fail v-if="fail" :stroke="stroke" :size="size"></vue-fail>\
                  <span v-if="showMessage" class="vue-spinner-message" transition="v-fade-in-out">\
                  {{ message }}\
                  </span>\
                </div>',
    props: {
      size: {
        type: Number,
        default: 50
      },
      stroke: {
        type: Number,
        default: 3.5
      },
      indeterminate: {
        type: Boolean,
        default: true
      },
      progress: {
        type: Number,
        default: null
      },
      success: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: null
      },
      fail: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      showMessage: function() {
        if (this.message === null) {
          return false;
        }

        if (this.success) {
          return true;
        }

        if (this.fail) {
          return true;
        }

        return false;
      },
      spinning: function() {
        if (this.success) {
          return false;
        }

        return true;
      },
      isIndeterminate: function() {
        if (this.indeterminate) {
          return true;
        } else {
          if (this.progress === null) {
            return true;
          }
        }

        return false;
      },
      classes: function() {
        return {
          'vue-indeterminate': this.isIndeterminate
        };
      },
      styles: function() {
        var newSize = this.size + 'px';
        return {
          width: newSize,
          height: newSize
        };
      },
      dashProgress: function() {
        if (this.isIndeterminate) {
          return false;
        }
        var progress = this.progress * 125 / 100;
        if (progress >= 125) {
          progress = 130;
        }
        return progress + ', 200';
      }
    }
  });
})();
