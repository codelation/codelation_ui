module Ui
  class ComponentGenerator < Rails::Generators::NamedBase
    source_root File.expand_path("../templates", __FILE__)

    def create_component_files
      if class_path.empty?
        destination_js = "app/assets/javascripts/application/components"
        destination_css = "app/assets/stylesheets/application/components"
        destination_html = "app/views/vue_components"
        template_js = "javascript.js.erb"
        template_css = "stylesheet.scss.erb"
        import_path = "vue_components"
        @component_id = "v-comp-#{file_name}-template"
        @component_class = "v-comp-#{file_name}"
      else
        src_folder = class_path.join("/").pluralize
        destination_js = File.join("app/assets/javascripts/application/views", src_folder, "templates")
        destination_css = File.join("app/assets/stylesheets/application/views", src_folder, "templates")
        destination_html = File.join("app/views", src_folder, "templates")
        template_js = "page_javascript.js.erb"
        template_css = "page_stylesheet.scss.erb"
        @page_name = src_folder
        import_path = "#{src_folder}/templates"
        @component_id = "v-#{@page_name}-#{file_name}-template"
        @component_class = "v-#{@page_name}-#{file_name}"
      end
      template_html = "template.html.erb"

      @component_name = file_name.camelize(:lower)


      template template_js, File.join(destination_js, "#{file_name}.js")
      template template_css, File.join(destination_css, "#{file_name}.scss")
      template template_html, File.join(destination_html, "_#{file_name}.html")

      puts
      puts "\tAdd to your views with: <%= render \"#{import_path}/#{file_name}\" %>"
      puts
    end
  end
end
