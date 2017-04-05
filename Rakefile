begin
  require "bundler/setup"
rescue LoadError
  puts "You must `gem install bundler` and `bundle install` to run rake tasks"
end

Bundler.require
Dir[File.join(File.dirname(__FILE__), "lib/tasks/**/*.rake")].each {|f| load f }
