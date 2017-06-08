require 'aws-sdk'

module CodelationUi
  class AwsProxy
    def put(name, contents, priv)
      obj = aws_object(name)
      if priv
        obj.put(body: contents)
      else
        obj.put(body: contents, acl: "public-read")
      end

      obj.public_url
    end

    def delete(file_url)
      obj = aws_object(strip_domain(file_url))
      obj.delete
    end

    def self.read(file)
      obj = aws_object(strip_domain(file_url))
      result = obj.get
      result.body
    end

    private

    def strip_domain(file_url)
      file_url.sub("https://#{ENV['AWS_BUCKET']}.s3-us-west-2.amazonaws.com/", "")
    end

    def aws_object(filename)
      s3 = Aws::S3::Resource.new()
      s3.bucket(ENV['AWS_BUCKET']).object(filename)
    end
  end
end
