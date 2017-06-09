require 'aws-sdk'
require 'mini_magick'
class FileProcessor
  def self.upload(file, args = {})
    return if file == "" || file.nil?
    size = args[:size] || args["size"]
    path = args[:path] || args["path"] || DateTime.now.strftime('%Y-%m-%d')
    priv = args[:private] || args["private"] || false
    filename = args[:name] || args["name"]
    
    if file.is_a?(String)
      return if filename.nil?
      s3 = Aws::S3::Resource.new()
      
      name = "#{path}/#{filename}"
      obj = s3.bucket(ENV['AWS_BUCKET']).object(name)
      if priv
        obj.put(body: file)
      else
        obj.put(body: file, acl: "public-read")
      end

      {
        name: filename,
        url: obj.public_url
      }
    else
      t_file = file.tempfile
      if size && file.content_type.match(/image\/.*/) && !file.content_type.include?("svg")
        parseFile = MiniMagick::Image.new(t_file.path).resize size
        t_file = parseFile
      end

      s3 = Aws::S3::Resource.new()
      obj_name = filename || file.original_filename
      name = "#{path}/#{SecureRandom.uuid}--#{obj_name}"
      obj = s3.bucket(ENV['AWS_BUCKET']).object(name)
      File.open(t_file.path) do |f|
        if priv
          obj.put(body: f)
        else
          obj.put(body: f, acl: "public-read")
        end
      end

      {
        name: obj_name,
        url: obj.public_url
      }
    end
  end

  def self.delete(file)
    s3 = Aws::S3::Resource.new()
    aws_file = file.sub("https://#{ENV['AWS_BUCKET']}.s3-us-west-2.amazonaws.com/", "")
    obj = s3.bucket(ENV['AWS_BUCKET']).object(aws_file)
    obj.delete
  end

  def self.read(file)
    s3 = Aws::S3::Resource.new()
    aws_file = file.sub("https://#{ENV['AWS_BUCKET']}.s3-us-west-2.amazonaws.com/", "")
    obj = s3.bucket(ENV['AWS_BUCKET']).object(aws_file)
    result = obj.get
    result.body
  end
end
