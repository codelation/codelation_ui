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
      _pluralize: pluralize,
      // Returns the lowerCamelCase form of a string.
      _dasherize: function(string) {
        return string.replace((/([a-z\d])([A-Z])/g), '$1_$2')
                     .toLowerCase()
                     .replace((/[ _]/g), '-');
      }
    }
  }

})();
