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
                    <input :disabled="disabled" id="{{ id}}" type="text" name="{{ name }}" v-if="showInputFor(\'number\')" v-on:keyup.up="incrementValue()" v-on:keyup.down="decrementValue()" v-model="inputValue" :placeholder="placeholder" v-el:input>\
                    <input :disabled="disabled" id="{{ id}}" type="text" name="{{ name }}" v-if="showInputFor(\'string\')" v-model="inputValue" :placeholder="placeholder" v-el:input>\
                    <input :disabled="disabled" id="{{ id}}" type="password" name="{{ name }}" v-if="showInputFor(\'password\')" v-model="inputValue" :placeholder="placeholder" v-el:input>\
                    <input :disabled="disabled" id="{{ id}}" type="text" name="{{ name }}" v-if="showInputFor(\'date\')" v-on:keyup.up="incrementValue()" v-on:keyup.down="decrementValue()" v-el:input v-model="inputValue" :placeholder="placeholder">\
                    <input :disabled="disabled" id="{{ id}}" type="checkbox" name="{{ name }}" v-if="showInputFor(\'bool\')" v-el:input v-model="inputValue">\
                    <input :disabled="disabled" id="{{ id}}" type="radio" name="{{ name }}" v-if="showInputFor(\'radio\')" v-el:input v-model="inputValue">\
                    <select :disabled="disabled" id="{{ id}}" v-if="showInputFor(\'select\')" v-model="inputValue" name="{{ name }}">\
                      <option v-for="option in optionsForSelect" :value="optionValue(option)">{{ optionLabel(option) }}</option>\
                    </select>\
                    <span v-if="showInputFor(\'toggle\')" class="vue-input-toggle">\
                      <input :disabled="disabled" id="{{ id}}" name="{{ name }}" type="checkbox" v-model="inputValue">\
                      <label for="{{ id}}"></label>\
                    </span>\
                    <div v-if="message" class="vue-input-message-container">\
                      <i class="fa fa-exclamation-triangle"></i><div><h5>{{ message }}</h5><p v-if="inputFormat">Format: {{ inputFormat }}</p></div>\
                    </div>\
                  </div>'

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
    'toggle': 'toggle',
    'text': 'text',
    'email': 'text',
    'phone': 'text',
    'password': 'password',
    'pass': 'password',
    'option': 'radio',
    'radio': 'radio',
    'select': 'select',
    'list': 'select'
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
    'toggle': 'toggle',
    'text': 'string',
    'password': 'password',
    'radio': 'radio',
    'select': 'select'
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
    mixins: [App.ui.interfaces.forms.input, App.ui.interfaces.std.validate, App.ui.interfaces.std.helpers],
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
        validating: false,
        formatting: true,
        renderHTML: false,
        obj: null,
        showInput: false,
        initialValue: this.value,
      }
    },
    ready: function() {
      if (this._valueIsEmpty(this.id)) {
        this.id = this._randomId();
      }

      // set the initial value
      if (this.isDate) {
        if (this._valueIsEmpty(this.value)) {
          this.inputValue = this.value;
        } else {
          this.inputValue = moment(this.value).format(this._formatForDate());
        }
      } else {
        this.inputValue = this.value;
      }

      this.renderHTML = true;
      var self = this;
      this.$nextTick(function() {
        self.setupNumber();
        self.setupDate();
        self.validating = true;
        $(self.$els.input).on('focus', self.validateContent);
      });
    },
    beforeDestroy: function() {
      try {
        $(self.$els.input).off('focus');
        $(this.$els.input).autoNumeric('destroy');
        this.obj.destroy();
      } catch (err) {}
    },
    watch: {
      value: function() {
        // set the initial value
        if (this.isDate) {
          if (this._valueIsEmpty(this.value)) {
            this.inputValue = this.value;
          } else {
            this.inputValue = moment(this.value).format(this._formatForDate());
          }
        } else {
          this.inputValue = this.value;
        }
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
      inputValue: function(newValue) {
        if (this.toString) {
          this.value = String(newValue);
        } else if (this.isDate) {
          if (this._valueIsEmpty(newValue)) {
            this.value = null;
          } else {
            this.value = new Date(newValue);
          }
        } else if (this.isNumber) {
          try {
            this.value = $(this.$els.input).autoNumeric('get');
          } catch (e) {
            this.value = newValue;
          }
        } else {
          this.value = newValue;
        }
        this.formatContent();
        this.validateContent();
      }
    },
    methods: {
      setupDate: function() {
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
        }
      },
      setupNumber: function() {
        if (this.isNumber) {

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

          $(this.$els.input).autoNumeric('init', baseOptions).on('keyup', function() {
            self.value = $(self.$els.input).autoNumeric('get');
          });
          $(this.$els.input).autoNumeric('set', this.inputValue);
        }
      },
      showInputFor: function(type) {
        if (!this.renderHTML) {
          return false;
        }

        return this.dataType === type;
      },
      incrementValue: function() {
        if (this.keyCodes) {
          if (this.isDate) {
            this.obj.nextMonth();
          }

          if (this.isNumber) {
            if (this.inputValue < this.max) {
              this.inputValue++;
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
            if (this.inputValue > this.min) {
              this.inputValue--;
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
            this.inputValue = App.ui.interfaces.std.format.methods._formatToPhoneNumber(this.inputValue);
          }
        }
      },
      validateContent: function() {
        this.message = null;
        this.inputFormat = null;
        if (this.validating && !this.disabled) {
          if (this._valueIsEmpty(this.inputValue)) {
            if (this.required) {
              this.message = "This can't be empty";
              this.inputFormat = this._formatForEmpty();
              return false;
            }
          }

          if (this.validate) {
            if (this.type === 'email') {
              var res = this._valueIsEmail(this.inputValue);
              if (!res) {
                this.message = "Not a valid email address.";
                this.inputFormat = this._formatForEmail();
                return false;
              }
            } else if (this.type === 'phone') {
              var res = this._valueIsPhone(this.inputValue);
              if (!res) {
                this.message = "Not a valid phone number.";
                this.inputFormat = this._formatForPhone();
                return false;
              }
            } else if (this.isDate) {
              var res = this._valueIsDate(this.inputValue);
              if (!res) {
                this.message = "Not a valid date.";
                this.inputFormat = this._formatForDate();
                return false;
              }
            } else if (this.isNumber) {
              if (this.hasUnrestrictedMax && numeral(this.inputValue).value() > this.max) {
                this.message = "Number out of range.";
                this.inputFormat = "less than or equal to " + this.max;
              } else if (this.hasUnrestrictedMin && numeral(this.inputValue).value() < this.min) {
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
