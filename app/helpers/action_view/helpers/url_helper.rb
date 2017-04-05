module ActionView
  module Helpers
    module UrlHelper
      def current_link_to(name = nil, options = nil, html_options = nil, &block)
        html_options, options, name = options, name, block if block_given?
        options ||= {}

        html_options = convert_options_to_data_attributes(options, html_options)

        url = url_for(options)

        if current_page?(url)
          html_options["class"] += " current"
        end

        html_options['href'] ||= url

        content_tag(:a, name || url, html_options, &block)
      end
    end
  end
end
