class FileProcessor
  # Legacy interface
  def self.upload(file, args = {})
    CodelationUi::FileProcessor.new(file).upload(args)
  end

  # Legacy interface
  def self.delete(file)
    CodelationUi::FileProcessor.new(file).delete
  end

  # Legacy interface
  def self.read(file)
    CodelationUi::FileProcessor.new(file).read
  end
end
