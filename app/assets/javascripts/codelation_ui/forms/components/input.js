//= require pikaday
//= require autonumeric

/*
DOCUMENTATION
==============
Examples
-------------

Plain Text Inputs
<vue-input :value.sync="variable" placeholder="Variable Input"></vue-input>

Email Inputs
<vue-input :value.sync="email" placeholder="Your email" type="email"></vue-input>

Date Inputs
<vue-input :value.sync="when" placeholder="When" type="calendar"></vue-input>

Number Inputs
<vue-input :value.sync="number" placeholder="Enter a number" type="number"></vue-input>
<vue-input :value.sync="number" placeholder="Enter a number" type="money"></vue-input>
<vue-input :value.sync="number" placeholder="Enter a number" type="percent"></vue-input>

Required positive number with upper unrestricted bounds
<vue-input :value.sync="number" placeholder="Enter a number" type="percent" :min="0" :max="100" :unrestricted-max="true"></vue-input>

Options
-------------
type     -> alias (plain text - no type)
calendar -> calendar, date
percent  -> percent
number   -> number, numeric
money    -> money, currency
email    -> email

precision (null)
Used on any number type (percent, number, money) to set the amount
of decimals used.  The defaults are 2 for numbers, 0 for percent, and 3 for money

min (null)
Sets the minimum value on number types (percent, number, money).

restrictMin (true)
Used to show a message rather than restrict actual input

max (null)
Sets the maximum value on number types (percent, number, money).

restrictMax (true)
Used to show a message rather than restrict actual input

placeholder (null)
Used to set the placeholder

required (false)
Used to show a message if the field is empty

validate (true)
Validates the format of the input if available.  Currently this
only supports the following types (email, date, unrestricted min and max)

toString (false)
Return the string version of the input rather than either a number or a date

noIcon (false)
Used to remove the icon if the field has one.  Only effects Date types right now.
*/

(function() {
  "use strict";

  var template = '<div class="vue-input" :class="[message ? \'has-message\' : \'\', disabled ? \'disabled\' : \'\', type]">\
                    <i v-if="inputIcon" v-on:click="activeObject()" class="vue-input-icon fa" :class="[inputIcon]"></i>\
                    <input :disabled="disabled" id="{{ id}}" type="text" name="{{ name }}" v-if="showInputFor(\'number\')" v-on:keyup.up="releaseIncrDecrKey()" v-on:keyup.down="releaseIncrDecrKey()" v-on:keydown.up="holdIncrKey()" v-on:keydown.down="holdDecrKey()" v-on:keyup.enter="inputChange()" :placeholder="placeholder" v-el:input>\
                    <input :disabled="disabled" id="{{ id}}" type="text" name="{{ name }}" v-if="showInputFor(\'string\')" v-on:keyup.enter="inputChange()" :placeholder="placeholder" v-el:input>\
                    <input :disabled="disabled" id="{{ id}}" type="password" name="{{ name }}" v-if="showInputFor(\'password\')" v-on:keyup.enter="inputChange()" :placeholder="placeholder" v-el:input>\
                    <input :disabled="disabled" id="{{ id}}" type="text" name="{{ name }}" v-if="showInputFor(\'date\')" v-on:keyup.enter="inputChange()" v-on:keyup.up="incrementValue()" v-on:keyup.down="decrementValue()" v-el:input :placeholder="placeholder">\
                    <template v-if="showAlert">\
                      <div v-if="message" class="vue-input-message-container">\
                        <i class="fa fa-exclamation-triangle"></i><div><h5>{{ message }}</h5><p v-if="inputFormat">Format: {{ inputFormat }}</p></div>\
                      </div>\
                    </template>\
                  </div>';

  var inputTypeMap = {
    'money': 'money',
    'currency': 'money',
    'number': 'number',
    'numeric': 'number',
    'date': 'date',
    'calendar': 'date',
    'percent': 'percent',
    'bool': 'bool',
    'check': 'bool',
    'checkbox': 'bool',
    'boolean': 'bool',
    'text': 'text',
    'email': 'text',
    'phone': 'text',
    'password': 'password',
    'pass': 'password',
    'website': 'url',
    'url': 'url'
  }

  var dataTypeMap = {
    'money': 'number',
    'currency': 'number',
    'number': 'number',
    'integer': 'number',
    'float': 'number',
    'numeric': 'number',
    'date': 'date',
    'calendar': 'date',
    'percent': 'number',
    'bool': 'bool',
    'check': 'bool',
    'boolean': 'bool',
    'text': 'string',
    'url': 'string',
    'password': 'password'
  }

  var autoNumericDefault = {
    aSign: '',
    pSign: 'p'
  }

  var numericDefaults = {
    'money': {
      aSign: '$',
      mDec: '2',
      wEmpty: 'empty'
    },
    'percent': {
      aSign: '%',
      mDec: '0',
      wEmpty: 'empty',
      pSign: 's'
    },
    'number': {
      wEmpty: 'empty'
    },
    'integer': {
      mDec: '0',
      wEmpty: 'empty'
    }
  }

  App.ui.components.forms.input = Vue.extend({
    mixins: [App.ui.interfaces.forms.input, App.ui.interfaces.std.validate, App.ui.interfaces.std.helpers, App.ui.interfaces.std.date],
    template: template,
    props: {
      'type': {
        default: 'plain'
      },
      'precision': {
        default: null
      },
      'min': {
        default: null
      },
      'max': {
        default: null
      },
      'numberLabel': {
        default: null
      },
      'numberPostLabel': {
        default: null
      },
      'numberPreLabel': {
        default: null
      },
      'restrictMax': {
        default: true
      },
      'restrictMin': {
        default: true
      },
      'placeholder': {
        default: null
      },
      'required': {
        default: false
      },
      'validate': {
        default: true
      },
      'onValidate': {
        default: null
      },
      'forcedError': {
        default: null
      },
      'toString': {
        default: false
      },
      'noIcon': {
        default: false
      },
      'value': {
        twoWay: true
      },
      'keyCodes': {
        default: true
      },
      'id': {
        default: null
      },
      'name': {
        default: null
      },
      'showAlert': {
        default: true
      },
      'optionsForSelect': {
        default: function() {
          return [];
        }
      },
      'disabled': {
        default: false
      }
    },
    data: function() {
      return {
        inputValue: null,
        message: null,
        inputFormat: null,
        validating: true,
        formatting: true,
        renderHTML: false,
        obj: null,
        showInput: false,
        incrInterval: null,
        incrTimeout: null,
        holdKey: false
      }
    },
    ready: function() {
      if (this._valueIsEmpty(this.id)) {
        this.id = this._randomId();
      }

      this.renderHTML = true;
      var self = this;
      this.$nextTick(function() {
        if (self.$els.input === undefined) {
          console.warn("Component not loaded")
        } else {
          self.$els.input.value = self.value;
          var x = window.scrollX,
            y = window.scrollY;
          var focusedNode = $(':focus')[0];
          self.$els.input.focus();
          window.scrollTo(x, y);
          self.$els.input.blur();
          if (focusedNode) {
            focusedNode.focus();
          }
          self.setupInputFormatter();
          self.setValue(self.value);
          $(self.$els.input).on('focus', self.validateContent);
          $(self.$els.input).on('focusout', self.releaseIncrDecrKey);
          $(self.$els.input).on('change', self.updateAndValidateContent);
          $(self.$els.input).on('keyup', self.inputKeyPress);
          $(self.$els.input).on('paste', function() {
            setTimeout(function() {
              self.inputChange();
            }, 100);
          });
        }

      });
    },
    beforeDestroy: function() {
      try {
        $(self.$els.input).off('focus');
        $(self.$els.input).off('focusout');
        $(self.$els.input).off('keyup');
        $(self.$els.input).off('paste');
        $(this.$els.input).autoNumeric('destroy');
        this.obj.destroy();
      } catch (err) {}
    },
    watch: {
      value: function(newValue, oldValue) {
        if (String(newValue) === String(oldValue) || String(newValue) === String(this.getValue())) {
          return;
        }

        this.setValue(newValue);
      },
      forcedError: {
        handler: function() {
          this.validateContent();
        },
        deep: true
      },
      disabled: function(newValue) {
        if (newValue) {
          this.validateContent();
        }
      },
      inputValue: function(newValue, oldValue) {
        if (String(newValue) === String(oldValue) || String(newValue) === String(this.value)) {
          return;
        }

        this.setParent(newValue);
        this.validateContent();
      }
    },
    methods: {
      setParent: function(value) {
        // Sets the parent value based on the params given
        if (this._valueIsEmpty(value)) {
          this.value = null;
        } else if (this.toString) {
          if (this.isDate) {
            if (this._valueIsDate(value)) {
              this.value = this._moment(value).format(this._formatForDate());
            }
          } else {
            this.value = String(value);
          }
        } else {
          this.value = value;
        }
      },
      inputKeyPress: function(e) {
        if (e.which <= 90 && e.which >= 48 || e.which >= 96 && e.which <= 111 || e.which >= 186 && e.which <= 222 || e.which === 8 || e.which === 13 || e.which === 46 || e.which === 45) {
          this.inputChange();
        }
      },
      inputChange: function() {
        this.inputValue = this.getValue();
        this.formatContent();
      },
      setValue: function(value) {
        // Sets the input value
        if (this.isNumber) {
          try {
            $(this.$els.input).autoNumeric('set', value);
          } catch (e) {
            this.$els.input.value = value;
          }
        } else if (this.isDate && this.obj !== null) {
          this.obj.setDate(value);
        } else {
          this.$els.input.value = value;
        }
      },
      getValue: function() {
        // Gets the value from the input and puts it in the correct type
        if (this.isNumber) {
          try {
            var val = $(this.$els.input).autoNumeric('get');
            if (this._valueIsEmpty(val)) {
              return null;
            } else {
              return numeral(val).value();
            }
          } catch (e) {
            var val = this.$els.input.value;
            if (this._valueIsEmpty(val)) {
              return null;
            } else {
              return numeral(val).value();
            }
          }
        } else if (this.isDate && this.obj !== null) {
          return this.obj.getDate();
        }

        return this.$els.input.value;
      },
      setupInputFormatter: function() {
        // Sets up autonumeric for numbers and pikaday for dates
        if (this.isDate) {
          var options = {
            field: this.$els.input,
            format: this._formatForDate()
          };

          if (this.hasRestrictedMax) {
            options['maxDate'] = new Date(this.max);
          }
          if (this.hasRestrictedMin) {
            options['minDate'] = new Date(this.min);
          }
          this.obj = new Pikaday(options);
        } else if (this.isNumber) {
          // Set options
          var baseOptions = JSON.parse(JSON.stringify(autoNumericDefault));
          var additionals = numericDefaults[this.type] || numericDefaults[this.dataType] || {};
          Object.keys(additionals).forEach(function(opt) {
            baseOptions[opt] = additionals[opt];
          });

          if (this.precision) {
            baseOptions['mDec'] = this.precision;
          }
          if (this.hasRestrictedMax) {
            baseOptions['vMax'] = this.max;
          }
          if (this.hasRestrictedMin) {
            baseOptions['vMin'] = this.min;
          }

          if (this.numberPostLabel || this.numberLabel) {
            baseOptions['aSign'] = this.numberPostLabel || this.numberLabel;
            baseOptions['pSign'] = 's';
          } else if (this.numberPreLabel) {
            baseOptions['aSign'] = this.numberPreLabel;
            baseOptions['pSign'] = 'p';
          }

          var self = this;
          try {
            $(this.$els.input).autoNumeric('destroy');
          } catch (err) {}

          $(this.$els.input).autoNumeric('init', baseOptions);
        }
      },
      showInputFor: function(type) {
        if (!this.renderHTML) {
          return false;
        }

        return this.dataType === type;
      },
      holdIncrKey: function() {
        if (!this.holdKey) {
          this.holdKey = true;
          this.incrementValue();
          var self = this;
          this.incrTimeout = setTimeout(function() {
            self.incrInterval = window.setInterval(self.incrementValue, 100);
          }, 500);
        }
      },
      holdDecrKey: function() {
        if (!this.holdKey) {
          this.holdKey = true;
          this.decrementValue();
          var self = this;
          this.incrTimeout = setTimeout(function() {
            self.incrInterval = window.setInterval(self.decrementValue, 100);
          }, 500);
        }
      },
      releaseIncrDecrKey: function() {
        this.holdKey = false;
        window.clearTimeout(this.incrTimeout);
        window.clearInterval(this.incrInterval);
        this.incrInterval = null;
      },
      incrementValue: function() {
        if (this.keyCodes) {
          if (this.isDate) {
            this.obj.nextMonth();
          }

          if (this.isNumber) {
            var tmp = this.getValue();
            if (this.max) {
              if (tmp < this.max) {
                this.setValue(tmp + 1);
                this.inputChange();
              }
            } else {
              this.setValue(tmp + 1);
              this.inputChange();
            }
          }
        }
      },
      decrementValue: function() {
        if (this.keyCodes) {
          if (this.isDate) {
            this.obj.prevMonth();
          }

          if (this.isNumber) {
            var tmp = this.getValue();
            if (this.min) {
              if (tmp > this.min) {
                this.setValue(tmp - 1);
                this.inputChange();
              }
            } else {
              this.setValue(tmp - 1);
              this.inputChange();
            }
          }
        }
      },
      activeObject: function() {
        if (this.isDate) {
          this.obj.show();
        }
      },
      formatContent: function() {
        if (this.formatting) {
          if (this.type === 'phone' && this._valueIsPhone(this.inputValue)) {
            this.setValue(App.ui.interfaces.std.format.methods._formatToPhoneNumber(this.inputValue));
          }
        }
      },
      updateAndValidateContent: function() {
        this.inputValue = this.getValue();
        this.formatContent();
        this.validateContent();
      },
      validateContent: function() {
        var value = this.getValue();
        this.message = null;
        this.inputFormat = null;
        if (this.validating && !this.disabled) {
          if (this._valueIsEmpty(value)) {
            if (this.required) {
              this.message = "This can't be empty";
              this.inputFormat = this._formatForEmpty();
              return false;
            }
          }

          if (this.validate) {
            if (this.type === 'email') {
              var res = this._valueIsEmail(value);
              if (!res) {
                this.message = "Not a valid email address.";
                this.inputFormat = this._formatForEmail();
                return false;
              }
            } else if (this.type === 'phone') {
              var res = this._valueIsPhone(value);
              if (!res) {
                this.message = "Not a valid phone number.";
                this.inputFormat = this._formatForPhone();
                return false;
              }
            } else if (this.type === 'url') {
              var res = this._valueIsUrl(value);
              if (!res) {
                this.message = "Not a valid URL.";
                this.inputFormat = this._formatForUrl();
                return false;
              }
            } else if (this.type === 'password') {
              if (this.min && String(value).length < this.min) {
                this.message = "Password is not long enough";
                this.inputFormat = "Required Length: " + this.min;
                return false;
              }
            } else if (this.isDate) {
              var res = this._valueIsDate(value);
              if (!res) {
                this.message = "Not a valid date.";
                this.inputFormat = this._formatForDate();
                return false;
              }
            } else if (this.isNumber) {
              if (this.hasUnrestrictedMax && numeral(value).value() > this.max) {
                this.message = "Number out of range.";
                this.inputFormat = "less than or equal to " + this.max;
              } else if (this.hasUnrestrictedMin && numeral(value).value() < this.min) {
                this.message = "Number out of range.";
                this.inputFormat = "greater than or equal to " + this.min;
              }
            }

            if (this.onValidate !== null) {
              var result = this.onValidate();
              if (result.valid) {
                return true;
              } else {
                this.message = result.message || "Invalid";
                this.inputFormat = result.inputFormat || "";
                return false;
              }
            }

            if (this.forcedError !== null) {
              if (!this.forcedError.valid) {
                this.message = this.forcedError.message || "Invalid";
                return false;
              }
            }
          }
        }
        return true;
      },
      optionValue: function(option) {
        return option.value || option;
      },
      optionLabel: function(option) {
        return option.label || option;
      }
    },
    computed: {
      inputType: function() {
        return inputTypeMap[this.type] || 'text';
      },
      dataType: function() {
        return dataTypeMap[this.inputType] || 'string';
      },
      isNumber: function() {
        if (this.dataType === 'number') {
          return true;
        } else {
          return false;
        }
      },
      isDate: function() {
        if (this.dataType === 'date') {
          return true;
        } else {
          return false;
        }
      },
      isBool: function() {
        if (this.dataType === 'bool') {
          return true;
        } else {
          return false;
        }
      },
      isString: function() {
        if (this.dataType === 'string') {
          return true;
        } else {
          return false;
        }
      },
      hasRestrictedMax: function() {
        if (this.max !== null && this.restrictMax) {
          return true;
        } else {
          return false;
        }
      },
      hasRestrictedMin: function() {
        if (this.min !== null && this.restrictMin) {
          return true;
        } else {
          return false;
        }
      },
      hasUnrestrictedMax: function() {
        if (this.max !== null && !this.restrictMax) {
          return true;
        } else {
          return false;
        }
      },
      hasUnrestrictedMin: function() {
        if (this.min !== null && !this.restrictMin) {
          return true;
        } else {
          return false;
        }
      },
      inputIcon: function() {
        if (this.isDate && !this.init) {
          return 'fa-calendar';
        }
      }
    }
  });
})();
