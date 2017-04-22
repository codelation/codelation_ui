module Ui
  class PageGenerator < Rails::Generators::NamedBase
    source_root File.expand_path("../templates", __FILE__)

    def create_asset_files
      destination_js = "app/assets/javascripts/application/views/pages"
      destination_css = "app/assets/stylesheets/application/views/pages"
      destination_html = "app/views/pages"
      template_html = "template.html.erb"
      template_js = "javascript.js.erb"
      template_css = "stylesheet.scss.erb"


      @register_name = "pages.#{file_name.dasherize}"
      @html_heading = "#{file_name.titleize}"
      template template_js, File.join(destination_js, "#{file_name}.js")
      template template_css, File.join(destination_css, "#{file_name}.scss")
      template template_html, File.join(destination_html, "#{file_name}.html.erb")
    end
  end
end
