//= require vue
//= require_self
//= require ./std

App.vue = {
  _info: 'Contains object references to all functionality that the UI offers as well as the reference to the root vue component',
  interfaces: {
    _info: 'Used for containing mixins and methods used for vue'
  },
  computedInterfaces: {
    _info: 'Same as interfaces except accepts arguments to alter the mixin before applying it to the component'
  },
  globalComponents: {
    _info: 'Used to define all global components'
  },
  components: {
    _info: 'Used to hold references to various vue components you may use or are not defined globaly'
  },
  config: {
    _info: 'Used to customize the functionality for some interfaces and components',
    main: {
      showInterfaces: true,
      includedInterfaces: []
    }
  },
  root: null,
  extend: {
    _info: 'Used to hold references to per page components and attach to the root component if you did not define one.'
  }
}
