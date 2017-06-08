(function() {
  "use strict";

  var app = window.App;
  var bodyClass,
    bodyElement;

  if (app === undefined) {
    app = window.App = {};
  }

  app.enterFunctions = {
    component: []
  };
  app.exitFunctions = {
    component: []
  };
  
  function matchBodyClasses(bodyClasses) {
    bodyClasses = " " + bodyClasses + " ";
    if (" " + bodyElement.className + " ").includes(bodyClasses)) {
      return true; 
    }else{
      return false;
    }
  }

  // Register functions to run when any page or specific pages are loaded.
  //
  // Example for running code only when `pages#home` loads:
  //
  //   App.register('pages.home').enter(function() {
  //     // Set up
  //   }).exit(function() {
  //     // Tear down (Might be needed for Turbolinks)
  //   });
  //
  // Example for running code on every page load:
  //
  //   App.register('component').enter(function() {
  //     // Set up
  //   }).exit(function() {
  //     // Tear down (Might be needed for Turbolinks)
  //   });
  app.register = function(mixed) {
    return {
      enter: function(callback) {
        app.registerEnter(mixed, callback);
        return this;
      },

      exit: function(callback) {
        app.registerExit(mixed, callback);
        return this;
      }
    };
  };

  app.registerEnter = function(key, callback) {
    if (app.enterFunctions[key] === undefined) {
      app.enterFunctions[key] = [];
    }
    app.enterFunctions[key].push(callback);
  };

  app.registerExit = function(key, callback) {
    if (app.exitFunctions[key] === undefined) {
      app.exitFunctions[key] = [];
    }
    app.exitFunctions[key].push(callback);
  };

  // Fires off any callbacks registered for enter, with or without Turbolinks.
  $(document).on('ready page:load page:restore', function() {
    bodyElement = document.body;

    // Determine which functions should be fired
    var fireConfigFunctions = [];
    var fireFirstFunctions = [];
    var fireFunctions = [];
    var fireLastFunctions = [];
    $.each(app.enterFunctions, function(key, functions) {
      bodyClass = key.split('.').join(' ');
      if (bodyClass === 'component' || matchBodyClasses(bodyClass)) {
        fireFunctions = fireFunctions.concat(functions);
      }

      if (bodyClass === 'last') {
        fireLastFunctions = fireLastFunctions.concat(functions);
      }

      if (bodyClass === 'first') {
        fireFirstFunctions = fireFirstFunctions.concat(functions);
      }

      if (bodyClass === 'config') {
        fireConfigFunctions = fireConfigFunctions.concat(functions);
      }
    });

    // Fire off each function
    $.each(fireConfigFunctions, function() {
      this.call();
    });
    $.each(fireFirstFunctions, function() {
      this.call();
    });
    $.each(fireFunctions, function() {
      this.call();
    });
    $.each(fireLastFunctions, function() {
      this.call();
    });
  });

  // Fires off any callbacks registered for exit, ONLY if using Turbolinks.
  $(document).on('page:before-unload', function() {
    var fireFirstFunctions = [];
    var fireFunctions = [];
    var fireLastFunctions = [];

    // Determine which functions should be fired
    $.each(app.exitFunctions, function(key, functions) {      
      bodyClass = key.split('.').join(' ');
      if (bodyClass === 'component' || matchBodyClasses(bodyClass)) {
        fireFunctions = fireFunctions.concat(functions);
      }

      if (bodyClass === 'last') {
        fireLastFunctions = fireLastFunctions.concat(functions);
      }

      if (bodyClass === 'first') {
        fireFirstFunctions = fireFirstFunctions.concat(functions);
      }
    });

    // Fire off each function
    $.each(fireFirstFunctions, function() {
      this.call();
    });
    $.each(fireFunctions, function() {
      this.call();
    });
    $.each(fireLastFunctions, function() {
      this.call();
    });
  });
})();
