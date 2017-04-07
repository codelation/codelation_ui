$:.push File.expand_path("../lib", __FILE__)

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "codelation_ui"
  s.version     = "1.0.25"
  s.authors     = ["Jake Humphrey"]
  s.email       = ["jake@codelation.com"]
  s.homepage    = "https://github.com/codelation/codelation_ui"
  s.summary     = "Base assets for rails asset pipeline"
  s.description = "Base assets for rails asset pipeline"
  s.licenses    = ["MIT"]

  s.files = Dir["{app,lib,vendor}/**/*", "LICENSE", "Rakefile", "README.md"]
  s.require_path = 'lib'

  s.add_dependency "rails", ">= 4.0"
  s.add_dependency "jquery-rails"
  s.add_dependency "turbolinks"
  s.add_development_dependency "rake"
  s.add_development_dependency "uglifier", "~> 2.7"
end
