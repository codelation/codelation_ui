(function() {
  "use strict";

  App.ui.interfaces.std.array = {
    methods: {
      _uniq: function(arr) {
        if (arr.constructor === Array) {
          var seen = {};
          var out = [];
          var len = arr.length;
          var j = 0;
          for (var i = 0; i < len; i++) {
            var item = arr[i];
            if (seen[item] !== 1) {
              seen[item] = 1;
              out[j++] = item;
            }
          }
          return out;
        } else {
          console.warn("_uniq only supports arrays");
          return -1;
        }
      }
    }
  }

})();
