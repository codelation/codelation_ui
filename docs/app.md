---
layout: default
links:
  - path: "/app#conditional-javascripts"
    text: "Conditional Javascripts"
    bold: true
  - path: "/app#per-controller-actionpage-javascript"
    text: "Per Controller Action/Page Javascript"
  - path: "/app#per-controller-javascript"
    text: "Per Controller Javascript"
  - path: "/app#nested-controller-actionpage-javascript"
    text: "Nested Controller Action/Page Javascript"
  - path: "/app#every-page-javascript"
    text: "Every Page Javascript"
  - path: "/app#run-first-javascript"
    text: "Run First Javascript"
  - path: "/app#run-last-javascript"
    text: "Run Last Javascript"
  - path: "/app#config-javascript"
    text: "Config Javascript"
  - path: "/app#ui-object"
    text: "UI Object"
    bold: true
---

# App Object

The **App** variable is accessible globally as a result of the `codelation_ui/base` package.  The most important part of this variable is the `register` function.  This works in tandum with **Turbolinks** to run javascript in different orders and only on certain pages.  

## Conditional Javascripts

#### Per Controller Action/Page Javascript
If you would like to run a script on only the `products/index` page, you would simply wrap your javascript in the following:

```javascript
App.register('products.index').enter(function(){
  // your code
}).exit(function(){
  // run code when the page leaves (WILL NOT STOP THE PAGE FROM REDIRECTING)
});
```
#### Per Controller Javascript
Additionally, you can run code for any of the `products` page with:

```javascript
App.register('products').enter(function(){
  // your code
});
```


#### Nested Controller Action/Page Javascript
As of **Version 1.1.0**, this now allows for nested controllers/routes. For example, you may nest a categories controller under your products controller actions and run code for only that with:

```javascript
App.register('products.categories.index').enter(function(){
  // your code
});
```

#### Every Page Javascript
If you would like to run javascript on any page, this is considered a `component`.  Here is how to define it:
```javascript
App.register('component').enter(function(){
  // your code
});
```

#### Run First Javascript
Sometimes you need to run code before any of your other scripts run.  This is useful for things like setting up vue components that other page wise components depend on.
```javascript
App.register('first').enter(function(){
  // your code
});
```

#### Run Last Javascript
Likewise, you can also specify a script to run last.
```javascript
App.register('last').enter(function(){
  // your code
});
```

#### Config Javascript
The config option to the register method allows for javascript to be run before any other registered scripts.  Why have both `first` and `config`?  First is great for setting up components and such, but what if those depend on some configuration options?  That is where this is useful.  Generally this is where you will set options in the `App.ui.config` object.
```javascript
App.register('config').enter(function(){
  // your code
});
```

## UI Object
By default, the UI object is outputted to the warnings console.  This object lives under the **App** object like the following:  `App.ui`.  This is structured as following:

```javascript
App.ui = {
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
  root: null, // Used to hold the reference to the root vue instance, if not found, it will define one
  extend: {
    _info: 'Used to hold references to per page components and attach to the root component if you did not define one.'
  }
}
```
