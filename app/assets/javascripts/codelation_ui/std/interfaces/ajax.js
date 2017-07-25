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
    if options_arg === undefined {
      options_arg = null;
    }
    var options = JSON.parse(JSON.stringify(options_arg)) || {};
    if defaultOptions_arg === undefined {
      defaultOptions_arg = null;
    }
    var defaultOptions = JSON.parse(JSON.stringify(defaultOptions_arg)) || {};

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
        
        // TODO: Implement all requests as form data.  Make file uploading much better
//         function jsonToFormData (inJSON, inTestJSON, inFormData, parentKey) {
//             // http://stackoverflow.com/a/22783314/260665
//             // Raj: Converts any nested JSON to formData.
//             var form_data = inFormData || new FormData();
//             var testJSON = inTestJSON || {};
//             for ( var key in inJSON ) {
//                 // 1. If it is a recursion, then key has to be constructed like "parent.child" where parent JSON contains a child JSON
//                 // 2. Perform append data only if the value for key is not a JSON, recurse otherwise!
//                 var constructedKey = key;
//                 if (parentKey) {
//                     constructedKey = parentKey + "." + key;
//                 }

//                 var value = inJSON[key];
//                 if (value && value.constructor === {}.constructor) {
//                     // This is a JSON, we now need to recurse!
//                     jsonToFormData (value, testJSON, form_data, constructedKey);
//                 } else {
//                     form_data.append(constructedKey, inJSON[key]);
//                     testJSON[constructedKey] = inJSON[key];
//                 }
//             }
//             return form_data;
//         }
        
        

        if (data instanceof(FormData)) {
          if (!App.ui.config.std.ajax.skipAuthenticityToken) {
            data.append('authenticity_token', App.ui.config.csrf_token);
          }
          
          return $.ajax({
              url: path,
              data: data || new FormData(),
              type: method || 'POST',
              processData: false,
              contentType: false,
              dataType: 'json'
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
