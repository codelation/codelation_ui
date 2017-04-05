# Codelation Assets

A collection of SCSS mixins and JavaScript helpers used by
[Codelation](https://codelation.com) for building awesome Rails apps quickly.

## Installation

Add this line to your application's Gemfile:

```ruby
gem "codelation_assets"
```

Install the Codelation Assets gem with Bundler:

```bash
bundle install
```

## JavaScript

Add to `application.js`:

```javascript
//= require codelation
```

### App Functions

The `App` object is used in Codelation's Rails projects to register components that
need to be initialized on every page and to sprinkle in JavaScript on specific pages.

#### Registering JavaScript Components

By using `App.register('component')`, you can fire some JavaScript on every page load.

The function passed to `enter` will fire for `$(document).on('ready page:load')`, so
it will work with or without Turbolinks.

The function passed to `exit` will fire for `$(document).on('page:before-unload')`,
so it will only work with Turbolinks, but will not be needed when not using Turbolinks.

Example:

```javascript
(function() {
  "use strict"

  var body, links;

  App.register('component').enter(function() {
    body = $('body');
    links = $('a[href]:not([href^="#"]):not([target="_blank"])');

    // Add 'loading' class to the body when a link is clicked,
    // add add 'active' class to the clicked link.
    links.click(function() {
      links.removeClass('active');
      body.addClass('loading');
      $(this).addClass('active');
    });
  }).exit(function() {
    // Remove the classes when the body is unloaded
    body.removeClass('loading');
    links.removeClass('active');
  });
})();
```

#### Registering Per Page JavaScript Snippets

You can use `App.register('[controller-name].[action-name]')` to fire some JavaScript any time
that page is loaded and unloaded. The `enter` and `exit` functions work the same as components.

This assumes you are using a helper to set the body class to include the dasherized controller
name and dasherized action.

Example:

```javascript
(function() {
  "use strict"

  var refreshInterval;

  // This will only fire when entering and exiting the `AwesomeStatsController#index` page.
  App.register('awesome-stats.index').enter(function() {
    // Poll a URL for new data at a set interval
    refreshInterval = setInterval(pollStats, 5000);
  }).exit(function() {
    // Clear the interval when the page is unloaded
    clearInterval(refreshInterval);
  });
})();
```

You can also use `App.register('[controller-name]')` to fire JavaScript on all pages
for the given controller name.

## Sass

Add to `application.scss`:

```scss
@import "codelation";
```

### Included Sass/CSS Libraries

- [Bourbon](http://bourbon.io) - A simple and lightweight mixin library for Sass.
- [Normalize.css](https://necolas.github.io/normalize.css/) - A modern, HTML5-ready alternative to CSS resets

### Additional Functions and Mixins

A handful of useful Sass functions and mixins written by Codelation are also included.

#### Sass Functions

##### color($color, $number: 500)

The [Google Material Design Colors](https://www.google.com/design/spec/style/color.html) come in handy when you
need a color for creating application interfaces. They are a much better alternative to CSS's named colors
(blue, green, red, etc.), but just as easy to use.

Examples:

```scss
// The named colors are available as variables of the same name
.warning {
  color: $amber;
}

// You can also use the different shades available
.error {
  color: color($red, 700);
}

// @see https://www.google.com/design/spec/style/color.html
.success {
  color: color($green, 600);
}
```

##### text-color($color)

This function is useful for creating mixins where you have a background color as a variable
and need to display either black or white text on top of the given color.

#### Sass Mixins

##### button($background-color: color($grey, 100), $color: color($grey, 800), $active-background-color: $accent-color, $active-color: text-color($accent-color))

By default, `@include button;` will create a plain grey button. It looks a lot like the default button in some
browsers, but it will be rendered to look the same across all browsers. Useful for applications that need to
be obvious about a button looking like a button.

##### center-children

This mixin uses flexbox to center the child elements horizontally and vertically inside the element.
A good use case is centering an image of unknown height inside a container with a fixed height.

##### has-cards($columns, $margin: 0)

This mixin uses flexbox to create a cards layout like that used by Google Material Design. The
mixin is used on the container element. This will create a fixed margin between each card element
and adds padding around the outside of the cards. Useful for creating a dashboard widgets look.

Example:

**HTML**

```html
<div class="dashboard">
  <div class="card"><div>
  <div class="card"><div>
  <div class="card"><div>
  <div class="card"><div>
</div>
```

**SCSS**

```scss
// This will create a cards layout with two cards per row.
// There will be a fixed margin of 1em between and around the cards.
// The cards in each row will stretch to be the same height.
.dashboard {
  @include has-cards(2, 1em);
  background-color: #ccc;

  .card {
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }
}
```

##### has-columns($columns: 0, $gutter: 0, $grow: true)

This mixin uses flexbox to create a layout with the specified number of columns that
stretch to fill the container's height. The given gutter size will the margin between
the columns. The container must be a single row of columns.

When the column count is given, the columns will all be the same width. If no column
count is given, the row will behave like a table row. The entire width will be used
and each column width will be determined by its content. `$grow` can be set to false
if you don't want the columns to take up the entire width of the container.

Example:

**HTML**

```html
<div class="row">
  <div>Column 1<div>
  <div>Column 2<div>
  <div>Column 3<div>
</div>

<div class="table">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
  <div>Column 4</div>
  <div>Column 5</div>
</div>
```

**SCSS**

```scss
// This will create a row with three columns.
// The columns will all fill the container height.
// There will be a fixed gutter of 12px between the columns.
.row {
  @include has-columns(3, 12px);
}

// This will create a row with five columns.
// The columns will all fill the container height and width.
// The width of each column will be determined by its content.
// There will be a fixed gutter of 10px between the columns.
.table {
  @include has-columns($gutter: 10px);
}
```

###### col-span($columns of $container-columns, $gutter: 0)

When the `has-columns` mixin is used properly, you can create columns in a row that
span the width of multiple columns in another row. In order to use the `col-span`
mixin, you must use a percentage value or zero for your gutter width. There is no way
to have a fixed gutter width, flexible column widths, and match up with the columns
in another row.

Example:

**HTML**

```html
<div class="row">
  <div>Column 1<div>
  <div>Column 2<div>
  <div>Column 3<div>
</div>
<div class="row">
  <div class="wide-column">Column 4<div>
  <div>Column 5<div>
</div>
```

**SCSS**

```scss
.row {
  @include has-columns(3, 3%);
}

// Column 4 will span across two columns. Its left side will match up with
// column 1's left side, and its right side will match up with column 2's right
// side. Column 5's right margin will be set to 0 without any extra SCSS.
.wide-column {
  @include col-span(2 of 3, 3%)
}
```

##### has-grid($columns, $gutter: 0)

This mixin uses flexbox to create a grid layout with an unknown number of child elements.
Each child element will have the same width and they will stretch to be the same height.
The gutter size is the width between each column and the height between each row. Unlike
the `has-cards` mixin, there will not be a margin around the child elements, only between.
This mixin is perfect for a product category page.

Example:

**HTML**

```html
<div class="products">
  <div>Product 1<div>
  <div>Product 2<div>
  <div>Product 3<div>
  <div>Product 4<div>
  <div>Product 5<div>
</div>
```

**SCSS**

```scss
// Products 1 - 3 will be on the first row and there will be a margin of 1em between them.
// Products 4 & 5 will be on the second row and will match up with products 1 & 2.
// There will be a margin of 1em between the rows.
.products {
  @include has-grid(3, 1em);
}
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
