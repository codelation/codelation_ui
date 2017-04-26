(function() {
  "use strict";

  // Config options
  App.ui.config.std.format = {
    'empty': '--',
    'currency': '0,0[.]00',
    'percent': '0,0[.]00',
    'number': '0,0[.]00',
    'date': 'MM/DD/YYYY',
  };

  App.ui.interfaces.std.format = {
    methods: {
      _formatToCurrency: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
          return nullReturn || App.ui.config.std.format.empty;
        }
        return App.ui.interfaces.std.number.methods._numeral(value).format('$' + (custom_number_format || App.ui.config.std.format.currency));
      },
      _formatToPercent: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
          return nullReturn || App.ui.config.std.format.empty;
        }
        return App.ui.interfaces.std.number.methods._numeral(value / 100).format((custom_number_format || App.ui.config.std.format.percent) + '%');
      },
      _formatToNumber: function(value, custom_number_format, nullReturn) {
        if (value === undefined || value === null || isNaN(value)) {
          return nullReturn || App.ui.config.std.format.empty;
        }
        return App.ui.interfaces.std.number.methods._numeral(value).format(custom_number_format || App.ui.config.std.format.number);
      },
      _formatToPhoneNumber: function(value, reg, nullReturn) {
        if (value === undefined || value === null) {
          return nullReturn || App.ui.config.std.format.empty;
        }
        var r = reg || /(?:(\+?(?:(\d{1,2}))\s?)?(\(?(?:(\d{3}))\)?(\s|-|\.)?)((?:(\d{3}))(\s|-|\.)?)((?:(\d{4}))))/i;
        var match = r.exec(value);
        if (match !== null && match.length === 11) {
          var areaCode = match[2] || 1;
          return '+' + areaCode + ' (' + match[4] + ') ' + match[7] + '-' + match[10];
        } else {
          return nullReturn || App.ui.config.std.format.empty;
        }
      },
      _formatToDate: function(value, custom_format, nullReturn) {
        if (value === undefined || value === null || !this._moment(value).isValid()) {
          return nullReturn || App.ui.config.std.format.empty;
        }
        return App.ui.interfaces.std.date.methods._moment(value).format(custom_format || App.ui.config.std.format.date);
      }
    }
  };
})();
