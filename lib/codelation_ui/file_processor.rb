require "codelation_ui/aws_proxy"
require "codelation_ui/mini_magick_proxy"
require "securerandom"

module CodelationUi
  class FileProcessor
    attr_reader :file, :aws_proxy, :minimagick_proxy

    def initialize(file, aws_proxy = AwsProxy.new, minimagick_proxy = MiniMagickProxy.new)
      @file = file
      @aws_proxy = aws_proxy
      @minimagick_proxy = minimagick_proxy
    end

    def upload(args = {})
      return if file == "" || file.nil?
      size = args[:size] || args["size"]
      path = args[:path] || args["path"] || DateTime.now.strftime('%Y-%m-%d')
      priv = args[:private] || args["private"] || false
      filename = args[:name] || args["name"]

      if file.is_a?(String)
        return if filename.nil?

        name = "#{path}/#{filename}"
        public_url = aws_proxy.put(name, file, priv)

        {
          name: filename,
          url: public_url
        }
      else
        t_file = file.tempfile
        if size && file.content_type.match(/image\/.*/) && !file.content_type.include?("svg")
          t_file = minimagick_proxy.resize(t_file.path, size)
        end

        obj_name = filename || file.original_filename
        name = "#{path}/#{SecureRandom.uuid}--#{obj_name}"
        File.open(t_file.path) do |f|
          public_url = aws_proxy.put(name, f, priv)
        end

        {
          name: obj_name,
          url: public_url
        }
      end
    end

    def delete
      aws_proxy.delete(file)
    end

    def read
      aws_proxy.read(file)
    end
  end

end
