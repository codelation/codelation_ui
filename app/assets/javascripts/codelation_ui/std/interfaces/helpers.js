(function() {
  "use strict";
  App.ui.interfaces.std.helpers = {
    methods: {
      _randomId: function() {
        return 'random-input-id-' + parseInt(Math.random() * 10000);
      }
    }
  };
})();
