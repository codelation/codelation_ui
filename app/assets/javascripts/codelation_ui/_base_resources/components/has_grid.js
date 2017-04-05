(function() {
  "use strict";

  // Used with the `has-grid` and `has-cards` Sass mixins,
  // it appends an extra span element for each missing column
  // based on the number of columns defined in the CSS.
  App.register('component').enter(function() {
    var columns, children, container, missingColumns;

    $('body *').each(function() {
      container = $(this);
      columns = container.css('column-count');

      // Ignore elements without column-count
      if (columns === 'auto') { return; }

      children = container.children().length;
      missingColumns = columns - (children % columns);
      for (var i = 0; i < missingColumns; i++) {
        container.append('<div></div>');
      }
    });
  });
})();
