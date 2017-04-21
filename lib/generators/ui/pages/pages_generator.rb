module Ui
  class PagesGenerator < Rails::Generators::NamedBase
    source_root File.expand_path("../templates", __FILE__)
    ACTIONS = %w(index show edit new)

    def create_asset_files
      destination_js = "app/assets/javascripts/application/views"
      destination_css = "app/assets/stylesheets/application/views"
      template_js = "javascript.js.erb"
      template_css = "stylesheet.scss.erb"

      ACTIONS.each do |action|

        # Check if need to generate for singular views (so don't create index view)
        next if file_name != plural_name && action == "index"

        @register_name = plural_name + ".#{action}"
        template template_js, File.join(destination_js, plural_name, "#{action}.js")
        template template_css, File.join(destination_css, plural_name, "#{action}.scss")
      end
    end

    def create_controller_files
      @controller_name = plural_name.titleize
      template 'controller.rb', File.join('app/controllers', "#{plural_name}_controller.rb")
    end

    def create_html_files
      destination_html = "app/views/#{plural_name}"
      template_html = "template.html.erb"

      ACTIONS.each do |action|
        # Check if need to generate for singular views (so don't create index view)
        next if file_name != plural_name && action == "index"

        template template_html, File.join(destination_html, "#{action}.html.erb")
      end
      empty_directory File.join(destination_html, "templates")
    end

    def generate_routes
      if file_name == plural_name
        inject_into_file "config/routes.rb", "\tresources :#{plural_name}\n", :before => /^end/
      else
        inject_into_file "config/routes.rb", "\tresource :#{file_name}\n", :before => /^end/
      end
    end
  end
end
