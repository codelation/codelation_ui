App.ui.computedInterfaces.std.mockAPI = function(data, objectString, options, initialFetch) {
  return {
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
        var self = this;
        this.$nextTick(function() {
          self[objectString] = JSON.parse(JSON.stringify(data));
          self._APIFetchSuccessful();
          self._APIFetchFinished();
        });

      },
      _APICreate: function(object, path) {
        this._APICurrentAction = "CREATE";
        this._APISaveSuccessful();
        this._APISaveFinished();
      },
      _APIUpdate: function(object, path) {
        this._APICurrentAction = "UPDATE";
        this._APISaveSuccessful();
        this._APISaveFinished();
      },
      _APIDelete: function(identifier, path) {
        this._APICurrentAction = "DELETE";
        this._APISaveSuccessful();
        this._APISaveFinished();
      }
    }
  }
}
