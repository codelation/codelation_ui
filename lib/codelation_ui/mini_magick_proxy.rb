require 'mini_magick'

module CodelationUi
  class MiniMagickProxy
    def resize(file_path, new_size)
      MiniMagick::Image.new(file_path).resize new_size
    end
  end
end
