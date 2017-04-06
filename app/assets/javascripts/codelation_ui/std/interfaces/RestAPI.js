(function(){
  "use strict";


  function url() {
    if (App.api.version === undefined) {
      return '/api';
    }else{
      return '/api/v' + App.api.version;
    }
  }

  function toPath(model) {
    var pluralModel = App.pluralize(model);
    var modelPath = App.dasherize(pluralModel);
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
  
  function sendRequest(url, method, data) {
    return $.ajax({
      url: url,
      type: method || 'GET',
      data: data || {}
    });
  }


  App.vue.interfaces.RestAPI = {
    methods: {
      RestfulGet: function(model, id, options) {
        if (App.vue.interfaces.contentValidators.methods._valueIsEmpty(id)) {
          return this.RestfulGetAll(model, options);
        }else{
          var url = toPath(model);
          var path = url + '/' + id;
        }
        var requestUrl = path + queryStringFromOptions(options, App.vue.config.RestAPI.DefaultOptions);
        return sendRequest(requestUrl, 'GET');
      },
      RestfulGetAll: function(model, options) {
        var requestUrl = toPath(model) + queryStringFromOptions(options, App.vue.config.RestAPI.DefaultOptions);
        return sendRequest(requestUrl, 'GET');
      },
      RestfulCreate: function(model, id, data, options) {
        var url = toPath(model);
        var path = url;
        var requestUrl = path + queryStringFromOptions(options, App.vue.config.RestAPI.DefaultOptions);
        return sendRequest(requestUrl, 'POST', data);
      },
      RestfulUpdate: function(model, id, data, options) {
        var url = toPath(model);
        if (App.vue.interfaces.contentValidators.methods._valueIsEmpty(id)) {
          var path = url + '/';
        }else{
          var path = url + '/' + id;
        }
        var requestUrl = path + queryStringFromOptions(options, App.vue.config.RestAPI.DefaultOptions);
        return sendRequest(requestUrl, 'PATCH', data);
      },
      RestfulDelete: function(model, id, options) {
        var url = toPath(model);
        var path = url + '/' + id;
        var requestUrl = path + queryStringFromOptions(options, App.vue.config.RestAPI.DefaultOptions);
        return sendRequest(requestUrl, 'DELETE');
      }
    }
  }

})();
