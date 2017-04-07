(function() {
  "use strict";
  
  // Config options
  App.vue.config.contentFormatters = {
    'empty': '--',
    'currency': '0,0[.]00',
    'percent': '0,0[.]00',
    'number': '0,0[.]00',
    'date': 'MM/DD/YYYY',
  };
  
  App.vue.interfaces.contentFormatters = {
    methods: {
      _formatToCurrency: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
         return nullReturn || App.vue.config.contentFormatters.empty; 
        }
        return this._numeral(value).format('$' + (custom_number_format || App.vue.config.contentFormatters.currency));
      },
      _formatToPercent: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
         return nullReturn || App.vue.config.contentFormatters.empty; 
        }
        return this._numeral(value / 100).format((custom_number_format || App.vue.config.contentFormatters.percent) + '%');
      },
      _formatToNumber: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
         return nullReturn || App.vue.config.contentFormatters.empty; 
        }
        return this._numeral(value).format(custom_number_format || App.vue.config.contentFormatters.number);
      },
      _formatToPhoneNumber: function(value, reg, nullReturn) {
        if (value === undefined || value === null) {
         return nullReturn || App.vue.config.contentFormatters.empty; 
        }
        var r = reg || /(?:(\+?(?:(\d{1,2}))\s?)?(\(?(?:(\d{3}))\)?(\s|-|\.)?)((?:(\d{3}))(\s|-|\.)?)((?:(\d{4}))))/i;
        var match = r.exec(value);
        if (match !== null && match.length === 11) {
          var areaCode = match[2] || 1;
          return '+' + areaCode + ' (' + match[4] + ') ' + match[7] + '-' + match[10];
        }else{
          return nullReturn || App.vue.config.contentFormatters.empty; 
        }
      },
      _formatToDate: function(value, custom_format, nullReturn) {
        if (value === undefined || value === null || !this._moment(value).isValid()) {
         return nullReturn || App.vue.config.contentFormatters.empty; 
        }
        return this._moment(value).format(custom_format || App.vue.config.contentFormatters.date);
      }
    }
  };
})();
