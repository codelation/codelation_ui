module Ui
  class PagesGenerator < Rails::Generators::NamedBase
    source_root File.expand_path("../templates", __FILE__)
    ACTIONS = %w(index show edit new)

    def create_asset_files
      destination_js = "app/assets/javascripts/application/views"
      destination_css = "app/assets/stylesheets/application/views"
      destination_html = "app/views"
      template_html = "template.html.erb"
      template_js = "javascript.js.erb"
      template_css = "stylesheet.scss.erb"

      if class_path.empty?
        ACTIONS.each do |action|

          # Check if need to generate for singular views (so don't create index view)
          next if file_name != plural_name && action == "index"

          @register_name = "#{plural_name.dasherize}.#{action.dasherize}"
          template template_js, File.join(destination_js, plural_name, "#{action}.js")
          template template_css, File.join(destination_css, plural_name, "#{action}.scss")

          @html_heading = case action
          when "index"
            file_name.titleize
          when "show"
            file_name
          else
            "#{action.titleize} #{file_name.singularize.titleize}"
          end

          template template_html, File.join(destination_html, plural_name, "#{action}.html.erb")
        end
        empty_directory File.join(destination_html, "templates")
      else
        src_folder = class_path.last.pluralize
        @html_heading = "#{file_name.titleize} #{class_path.last.titleize}"
        @register_name = "#{src_folder.dasherize}.#{file_name.dasherize}"
        template template_js, File.join(destination_js, src_folder, "#{file_name}.js")
        template template_css, File.join(destination_css, src_folder, "#{file_name}.scss")
        template template_html, File.join(destination_html, src_folder, "#{file_name}.html.erb")
      end
    end

    def create_controller_files
      name = if class_path.empty?
        @controller_name = plural_name.classify
        plural_name
      else
        @controller_name = class_path.last.classify
        class_path.last.pluralize.underscore
      end

      controller_file = File.join('app/controllers', "#{name}_controller.rb")
      unless File.exists?(controller_file)
        template 'controller.rb', controller_file
      end
    end

    def generate_routes
      if class_path.empty?
        if file_name == plural_name
          inject_into_file "config/routes.rb", "\tresources :#{plural_name}\n", before: /^end/
        else
          inject_into_file "config/routes.rb", "\tresource :#{file_name}\n", before: /^end/
        end
      else
        src_folder = class_path.last.pluralize
        inject_into_file "config/routes.rb", "\tget \"#{class_path.last}/#{file_name}\", to: \"#{src_folder}##{file_name}\", as: :#{file_name}_#{class_path.last}\n", before: /^end/
      end
    end
  end
end
