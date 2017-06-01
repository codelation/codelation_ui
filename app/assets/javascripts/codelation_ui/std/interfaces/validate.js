(function() {
  "use strict";
  App.ui.interfaces.std.validate = {
    methods: {
      _formatForEmpty: function() {
        return null;
      },
      _valueIsEmpty: function(value) {
        if (value === undefined || value === null || String(value).trim().length < 1) {
          return true;
        } else {
          return false;
        }
      },
      _formatForUrl: function() {
        return "http://example.com";
      },
      _valueIsUrl: function(url) {
        var r = /^((http|https):\/\/)?[\w-]+(\.[\w-]{2,})+(\/[\w-]*)*(\?([\w-%]+=[\w-%]+)(&([\w-%]+=[\w-%]+))*)?/i;
        if (r.test(url)) {
          return true;
        } else {
          return false;
        }
      },
      _formatForDate: function() {
        return 'MM/DD/YYYY';
      },
      _valueIsDate: function(date) {
        var r = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/\d\d\d\d$/;
        if (r.test(date)) {
          return true;
        } else {
          return false;
        }
      },
      _formatForEmail: function() {
        return 'user@domain.com';
      },
      _valueIsEmail: function(email) {
        var r = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (r.test(email)) {
          return true;
        } else {
          return false;
        }
      },
      _formatForPhone: function() {
        return '+X (XXX) XXX-XXXX';
      },
      _valueIsPhone: function(phone) {
        var r = /^(?:(\+?(?:(\d{1,2}))\s?)?(\(?(?:(\d{3}))\)?(\s|-|\.)?)((?:(\d{3}))(\s|-|\.)?)((?:(\d{4}))))$/i;
        if (r.test(phone)) {
          return true;
        } else {
          return false;
        }
      }
    }
  };
})();
