(function() {
  "use strict";

  // Config options
  App.ui.config.std.ajax = {
    'options': {},
    'version': null,
    'url': '/api',
    'skipAuthenticityToken': false
  };

  function url() {
    if (App.ui.config.std.ajax.version === null) {
      return App.ui.config.std.ajax.url;
    } else {
      return App.ui.config.std.ajax.url + '/v' + App.ui.config.std.ajax.version;
    }
  }

  function queryStringFromOptions(options_arg, defaultOptions_arg) {
    var queries = [];

    var options = options_arg || {};
    var defaultOptions = defaultOptions_arg || {};

    // Add options to default options (overwrites any default)
    Object.keys(options).forEach(function(key) {
      defaultOptions[key] = options[key];
    });

    Object.keys(defaultOptions).forEach(function(key) {
      queries.push(App.ui.interfaces.std.string.methods._underscore(key) + "=" + defaultOptions[key]);
    });

    if (queries.length > 0) {
      return '?' + queries.join('&');
    } else {
      return '';
    }
  }

  App.ui.interfaces.std.ajax = {
    methods: {
      _sendRequest: function(endpoint, method, data) {
        var path = url() + '/' + endpoint;

        if (data instanceof(FormData)) {
          if (!App.ui.config.std.ajax.skipAuthenticityToken) {
            data.append('authenticity_token', App.ui.config.csrf_token);
          }
          
          return $.ajax({
              url: path,
              data: data || new FormData(),
              type: method || 'POST',
              processData: false,
              contentType: false
          });
        }else{
          if (!App.ui.config.std.ajax.skipAuthenticityToken && data) {
            data['authenticity_token'] = App.ui.config.csrf_token;
          }

          return $.ajax({
            url: path,
            type: method || 'GET',
            data: data || {}
          });
        }
      },
      _getRequest: function(endpoint, options) {
        var requestUrl = endpoint + queryStringFromOptions(options, App.ui.config.std.ajax.options);
        return App.ui.interfaces.std.ajax.methods._sendRequest(requestUrl, 'GET');
      },
      _postRequest: function(endpoint, data, options) {
        var requestUrl = endpoint + queryStringFromOptions(options, App.ui.config.std.ajax.options);
        return App.ui.interfaces.std.ajax.methods._sendRequest(requestUrl, 'POST', data);
      },
      _deleteRequest: function(endpoint, data, options) {
        var requestUrl = endpoint + queryStringFromOptions(options, App.ui.config.std.ajax.options);
        return App.ui.interfaces.std.ajax.methods._sendRequest(requestUrl, 'DELETE', data);
      },
      _patchRequest: function(endpoint, data, options) {
        var requestUrl = endpoint + queryStringFromOptions(options, App.ui.config.std.ajax.options);
        return App.ui.interfaces.std.ajax.methods._sendRequest(requestUrl, 'PATCH', data);
      }
    }
  };
})();
