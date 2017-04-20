module Ui
  class MixinGenerator < Rails::Generators::NamedBase
    source_root File.expand_path("../templates", __FILE__)

    def create_asset_files
      destination_js = "app/assets/javascripts/application/mixins"
      template_js = "javascript.js.erb"
      template template_js, File.join(destination_js, "#{file_name}.js")
    end
  end
end
