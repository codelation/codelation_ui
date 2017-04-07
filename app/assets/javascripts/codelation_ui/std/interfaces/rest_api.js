(function(){
  "use strict";

  // Config options
  App.vue.config.rest_api = {
    'options': {},
    'version': null
  };
  
  

  function url() {
    if (App.vue.config.rest_api.version === null) {
      return '/api';
    }else{
      return '/api/v' + App.vue.config.rest_api.version;
    }
  }

  function toPath(model) {
    var pluralModel = App.vue.interfaces.string.methods._pluralize(model);
    var modelPath = App.vue.interfaces.string.methods._dasherize(pluralModel);
    return url() + '/' + modelPath;
  }

  function queryStringFromOptions(options_arg, defaultOptions_arg) {
    var queries = [];

    var options = options_arg || {};
    var defaultOptions = defaultOptions_arg || {};

    Object.keys(options).forEach(function(key) {
      queries.push(App.vue.interfaces.string.methods._underscore(key) + "=" + options[key]);
    });

    Object.keys(defaultOptions).forEach(function(key) {
      queries.push(App.vue.interfaces.string.methods._underscore(key) + "=" + defaultOptions[key]);
    });

    if (queries.length > 0) {
      return '?'+queries.join('&');
    } else {
      return '';
    }
  }

  App.vue.interfaces.rest_api = {
    methods: {
      _sendRequest: function(url, method, data) {
        return $.ajax({
          url: url,
          type: method || 'GET',
          data: data || {}
        });
      },
      _restfulGet: function(model, id, options) {
        if (App.vue.interfaces.contentValidators.methods._valueIsEmpty(id)) {
          return this._restfulGetAll(model, options);
        }else{
          var url = toPath(model);
          var path = url + '/' + id;
        }
        var requestUrl = path + queryStringFromOptions(options, App.vue.config.rest_api.options);
        return this._sendRequest(requestUrl, 'GET');
      },
      _restfulGetAll: function(model, options) {
        var requestUrl = toPath(model) + queryStringFromOptions(options, App.vue.config.rest_api.options);
        return this._sendRequest(requestUrl, 'GET');
      },
      _restfulCreate: function(model, id, data, options) {
        var url = toPath(model);
        var path = url;
        var requestUrl = path + queryStringFromOptions(options, App.vue.config.rest_api.options);
        return this._sendRequest(requestUrl, 'POST', data);
      },
      _restfulUpdate: function(model, id, data, options) {
        var url = toPath(model);
        if (App.vue.interfaces.contentValidators.methods._valueIsEmpty(id)) {
          var path = url + '/';
        }else{
          var path = url + '/' + id;
        }
        var requestUrl = path + queryStringFromOptions(options, App.vue.config.rest_api.options);
        return this._sendRequest(requestUrl, 'PATCH', data);
      },
      _restfulDelete: function(model, id, options) {
        var url = toPath(model);
        if (App.vue.interfaces.contentValidators.methods._valueIsEmpty(id)) {
          var path = url + '/';
        }else{
          var path = url + '/' + id;
        }
        var requestUrl = path + queryStringFromOptions(options, App.vue.config.rest_api.options);
        return this._sendRequest(requestUrl, 'DELETE');
      }
    }
  }
})();
