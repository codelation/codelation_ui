(function() {
  "use strict";
  App.vue.interfaces.contentFormatters = {
    methods: {
      _formatToCurrency: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
         return nullReturn || '-'; 
        }
        return numeral(value).format('$' + (custom_number_format || '0,0[.]00'));
      },
      _formatToPercent: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
         return nullReturn || '-'; 
        }
        return numeral(value / 100).format((custom_number_format || '0,0[.]00') + '%');
      },
      _formatToNumber: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
         return nullReturn || '-'; 
        }
        return numeral(value).format(custom_number_format || '0,0[.]00');
      },
      _formatToPhoneNumber: function(value, reg, nullReturn) {
        if (value === undefined || value === null) {
         return nullReturn || '-'; 
        }
        var r = reg || /(?:(\+?(?:(\d{1,2}))\s?)?(\(?(?:(\d{3}))\)?(\s|-|\.)?)((?:(\d{3}))(\s|-|\.)?)((?:(\d{4}))))/i;
        var match = r.exec(value);
        if (match !== null && match.length === 11) {
          var areaCode = match[2] || 1;
          return '+' + areaCode + ' (' + match[4] + ') ' + match[7] + '-' + match[10];
        }else{
          return nullReturn || '-'; 
        }
      },
      _formatToDate: function(value, custom_format, nullReturn) {
        if (value === undefined || value === null || !moment(value).isValid()) {
         return nullReturn || '-'; 
        }
        return moment(value).format(custom_format || 'MM/DD/YYYY');
      }
    }
  };
})();
