App.vue.computedInterfaces.mockAPI = function(data, objectString, queryData) {
  return {
    ready: function() {
      var self = this;
      this.$nextTick(function(){
        self[objectString] = data;
        self.queryData = queryData || {};
        self.ready();
      });
    },
    methods: {
      ready: function() {

      }
    }
  }
}
