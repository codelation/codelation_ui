(function(){
  "use strict";

  App.vue.interfaces.string = {
    methods: {
      // Returns the lowerCamelCase form of a string.
      _underscore: function(string) {
        return string.replace((/([a-z\d])([A-Z])/g), '$1_$2')
                     .toLowerCase()
                     .replace((/[ -]/g), '_');
      },
      // Returns the Plural form of the string
      _pluralize: function(string) {
        if (string.substr(string.length - 1) === "s"){
          return string + "es";
        }

        if (string.substr(string.length - 1) === "y"){
          return string.substr(0, string.length - 1) + "ies";
        }

        return string + "s";
      },
      // Returns the lowerCamelCase form of a string.
      _dasherize: function(string) {
        return string.replace((/([a-z\d])([A-Z])/g), '$1_$2')
                     .toLowerCase()
                     .replace((/[ _]/g), '-');
      }
    }
  }

})();
