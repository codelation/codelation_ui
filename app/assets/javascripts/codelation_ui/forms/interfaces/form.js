(function() {
  "use strict";

  // Exposes method validateForm(success, fail)
  App.ui.config.forms.form = {
    disableValidation: false
  }

  App.ui.interfaces.forms.form = {
    data: function() {
      return {
        form: {
          formValidationWatch: true,
          formValidationInputs: 0,
          formValidationResponded: 0,
          formValidationValid: true,
          formValidationValidAction: null,
          formValidationInvalidAction: null,
          formValidationErrorMessage: null,
          formValidationDeveloperMode: false,
        }
      }
    },
    ready: function() {
      if (App.ui.config.form.disableValidation == true) {
        this.form.formValidationDeveloperMode = true;
        console.error("VUE FORMS DEVELOPER MODE: Validations will not fail the form");
      }
    },
    methods: {
      _formValidationRespondToForm: function() {
        if (this.form.formValidationWatch && this.form.formValidationResponded === this.form.formValidationInputs) {
          if (this.form.formValidationValid && typeof this.form.formValidationValidAction === 'function') {
            this.form.formValidationValidAction();
          } else if (!this.form.formValidationValid && typeof this.form.formValidationInvalidAction === 'function') {
            this.form.formValidationInvalidAction();
          }
        }
      },
      _formValidationValidateCallback: function(valid) {
        this.form.formValidationResponded++;
        if (this.form.formValidationValid) {
          this.form.formValidationValid = valid;
        }
        this._formValidationRespondToForm();
      },
      validateForm: function(successCB, failCB) {
        if (this.form.formValidationDeveloperMode === true) {
          successCB();
          return;
        }
        this.form.formValidationWatch = false;
        this.form.formValidationErrorMessage = null;
        this.form.formValidationResponded = 0;
        this.form.formValidationValid = true;
        this.form.formValidationValidAction = successCB || null;
        this.form.formValidationInvalidAction = failCB || null;
        this.form.formValidationWatch = true;

        if (this.form.formValidationInputs < 1) {
          this._formValidationRespondToForm();
        } else {
          this.$broadcast('_form-validation-validate-inputs', this._formValidationValidateCallback);
        }
      }
    },
    events: {
      '_form-validation-inputs-check-in': function() {
        this.form.formValidationInputs++;
      },
      '_form-validation-inputs-check-out': function() {
        this.form.formValidationInputs--;
      }
    }
  };
})();
