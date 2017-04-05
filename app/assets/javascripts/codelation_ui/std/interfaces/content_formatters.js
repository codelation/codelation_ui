(function() {
  "use strict";
  App.vue.interfaces.contentFormatters = {
    methods: {
      _formatToCurrency: function(value, custom_number_format) {
        return numeral(value).format('$' + (custom_number_format || '0,0[.]00'));
      },
      _formatToPercent: function(value, custom_number_format) {
        return numeral(value / 100).format((custom_number_format || '0,0[.]00') + '%');
      },
      _formatToNumber: function(value, custom_number_format) {
        return numeral(value).format(custom_number_format || '0,0[.]00');
      },
      _formatToPhoneNumber: function(value) {
        var r = /(?:(\+?(?:(\d{1,2}))\s?)?(\(?(?:(\d{3}))\)?(\s|-|\.)?)((?:(\d{3}))(\s|-|\.)?)((?:(\d{4}))))/i;
        var match = r.exec(value);
        if (match !== null && match.length === 11) {
          var areaCode = match[2] || 1;
          return '+' + areaCode + ' (' + match[4] + ') ' + match[7] + '-' + match[10];
        }
      },
      _formatToDate: function(value) {
        return moment(date).format('MM/DD/YYYY');
      }
    }
  };
})();
