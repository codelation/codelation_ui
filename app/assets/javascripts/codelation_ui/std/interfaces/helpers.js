(function() {
  "use strict";
  App.vue.interfaces.helpers = {
    methods: {
      _randomId: function() {
        return 'random-input-id-' + parseInt(Math.random() * 10000);
      }
    }
  };
})();
