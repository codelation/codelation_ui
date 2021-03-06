App.ui.computedInterfaces.std.API = function(model, objectString, options, initialFetch) {
  return {
    mixins: [App.ui.interfaces.std.ajax],
    data: function() {
      return {
        APICurrentAction: 'READ'
      }
    },
    computed: {
      _APICurrentAction: {
        get: function() {
          return this.APICurrentAction;
        },
        set: function(value) {
          this.APICurrentAction = value;
        }
      }
    },
    ready: function() {
      if (initialFetch === undefined || initialFetch === true) {
        this._APIFetch();
      }
    },
    methods: {
      _APIFetchSuccessful: function() {},
      _APIFetchFailed: function(error) {},
      _APIFetchFinished: function() {},
      _APISaveSuccessful: function() {},
      _APISaveFailed: function(error) {},
      _APISaveFinished: function() {},
      _APIFetch: function() {
        this._APICurrentAction = "READ";
        var path = model;
        if (this.id) {
          path = path + '/' + this.id
        }
        var request = this._getRequest(path, options);

        var self = this;
        request.done(function(json) {
          self[objectString] = json;
          self._APIFetchSuccessful();
        });

        request.fail(function(json) {
          self._APIFetchFailed(json);
        });

        request.always(function() {
          self._APIFetchFinished();
        });
      },
      _APICreate: function(object, path) {
        this._APICurrentAction = "CREATE";
        var endpoint = path || model;
        var request = this._postRequest(endpoint, object, options);

        var self = this;
        request.done(function(json) {
          self._APISaveSuccessful();
        });

        request.fail(function(json) {
          self._APISaveFailed(json);
        });

        request.always(function() {
          self._APISaveFinished();
        });
      },
      _APIUpdate: function(object, path) {
        this._APICurrentAction = "UPDATE";
        var endpoint = path || model;

        var path = endpoint;
        if (this.id) {
          path = path + '/' + this.id
        }

        var request = this._patchRequest(path, object, options);
        var self = this;
        request.done(function(json) {
          self._APISaveSuccessful();
        });

        request.fail(function(json) {
          self._APISaveFailed(json);
        });

        request.always(function() {
          self._APISaveFinished();
        })
      },
      _APIDelete: function(identifier, path) {
        this._APICurrentAction = "DELETE";
        var endpoint = path || model;
        options.id = identifier;
        var request = this._deleteRequest(endpoint, options);
        var self = this;
        request.done(function(json) {
          self._APISaveSuccessful();
        });

        request.fail(function(json) {
          self._APISaveFailed(json);
        });

        request.always(function() {
          self._APISaveFinished();
        });
      }
    }
  }
}
