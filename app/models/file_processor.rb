require 'aws-sdk'
require 'mini_magick'
class FileProcessor
  def self.upload(file, size = nil)
    return if file == "" || file.nil?
    t_file = file.tempfile
    if size && file.content_type.match(/image\/.*/) && !file.content_type.include?("svg")
      parseFile = MiniMagick::Image.new(t_file.path).resize size
      ap parseFile
      t_file = parseFile
    end

    s3 = Aws::S3::Resource.new()

    name = "#{DateTime.now.strftime('%Y-%m-%d')}/#{SecureRandom.uuid}--#{file.original_filename}"
    obj = s3.bucket(ENV['AWS_BUCKET']).object(name)
    File.open(t_file.path) do |f|
      obj.put(body: f, acl: "public-read")
    end

    {
      name: file.original_filename,
      url: obj.public_url
    }
  end

  def self.delete(file)
    s3 = Aws::S3::Resource.new()
    aws_file = file.sub("https://#{ENV['AWS_BUCKET']}.s3-us-west-2.amazonaws.com/", "")
    obj = s3.bucket(ENV['AWS_BUCKET']).object(aws_file)
    obj.delete
  end
end
