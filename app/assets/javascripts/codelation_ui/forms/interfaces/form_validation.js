(function() {
  "use strict";

  App.vue.interfaces.formValidation = {
    ready: function() {
      // Check the input into the vue form
      this.$dispatch('_form-validation-inputs-check-in');
    },
    beforeDestroy: function() {
      // check out the input from the vue form
      this.$dispatch('_form-validation-inputs-check-out');
    },
    events: {
      '_form-validation-validate-inputs': function(callback){
        var valid = true;
        if (!this.validateContent()) {
          valid = false;
        }
        if (typeof callback === 'function') {
          callback(valid);
        }
      }
    },
    methods: {
      validateContent: function(){
        console.warn('Method no implemented: validateContent()');
        return true;
      }
    }
  };
})();
