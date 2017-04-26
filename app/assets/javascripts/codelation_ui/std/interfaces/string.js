(function() {
  "use strict";

  App.ui.interfaces.std.string = {
    methods: {
      // Replaces spaces and reverts capital letters to lowercase with underscore before them.
      _underscore: function(string) {
        return string.replace((/([a-z\d])([A-Z])/g), '$1_$2')
          .toLowerCase()
          .replace((/[ -]/g), '_');
      },
      // Changes the word into the plural form
      _pluralize: pluralize,
      // Replaces spaces and reverts capital letters to lowercase with dash before them.
      _dasherize: function(string) {
        return string.replace((/([a-z\d])([A-Z])/g), '$1_$2')
          .toLowerCase()
          .replace((/[ _]/g), '-');
      },
      // Changes a character after any break in the string to the capital version
      _titleize: function(string) {
        return string.replace((/([a-z\d])([A-Z])/g), '$1_$2').toLowerCase().replace(/(?:^|\s|-|_)\S/g, function(m) {
          return m.toUpperCase();
        }).replace((/[ _-]/g), ' ');
      }
    }
  }

})();
