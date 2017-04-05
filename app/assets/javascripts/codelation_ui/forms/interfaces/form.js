(function() {
  "use strict";

  // Exposes method validateForm(success, fail)

  App.vue.interfaces.form = {
    data: function() {
      return {
        _formValidationWatch: true,
        _formValidationInputs: 0,
        _formValidationResponded: 0,
        _formValidationValid: true,
        _formValidationValidAction: null,
        _formValidationInvalidAction: null,
        _formValidationErrorMessage: null,
        _formValidationDeveloperMode: false
      }
    },
    ready: function() {
      if (App.vue.config.disableVueFormValidations == true) {
        this._formValidationDeveloperMode = true;
        console.error("VUE FORMS DEVELOPER MODE: Validations will not fail the form");
      }
    },
    methods: {
      _formValidationRespondToForm: function() {
        if (this._formValidationWatch && this._formValidationResponded === this._formValidationInputs) {
          if (this._formValidationValid && typeof this._formValidationValidAction === 'function') {
            this._formValidationValidAction();
          }else if (!this._formValidationValid && typeof this._formValidationInvalidAction === 'function') {
            this._formValidationInvalidAction();
          }
        }
      },
      _formValidationValidateCallback: function(valid) {
        this._formValidationResponded++;
        if (this._formValidationValid) {
          this._formValidationValid = valid;
        }
        this._formValidationRespondToForm();
      },
      validateForm: function(successCB, failCB) {
        if (this._formValidationDeveloperMode === true) {
          successCB();
          return;
        }
        this._formValidationWatch = false;
        this._formValidationErrorMessage = null;
        this._formValidationResponded = 0;
        this._formValidationValid = true;
        this._formValidationValidAction = successCB || null;
        this._formValidationInvalidAction = failCB || null;
        this._formValidationWatch = true;

        if (this._formValidationInputs < 1) {
          this._formValidationRespondToForm();
        }else{
          this.$broadcast('_form-validation-validate-inputs', this._formValidationValidateCallback);
        }
      }
    },
    events: {
      '_form-validation-inputs-check-in': function() {
        this._formValidationInputs++;
      },
      '_form-validation-inputs-check-out': function() {
        this._formValidationInputs--;
      }
    }
  };
})();
