
(function() {
  "use strict";

  App.ui.interfaces.std.number = {
    methods: {
      _numeral: numeral,
      // checks if the denominator is zero and returns zero
      _safeDivide: function(num, den) {
        if (den === 0) {
          return 0;
        } else {
          // Mult by float ensures that decimals are not stripped like dividing two integers can cause
          return (num * 1.0) / den;
        }
      }
    }
  }

})();
