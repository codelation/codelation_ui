require "codelation_ui/file_processor"

RSpec.describe CodelationUi::FileProcessor, type: :model do
  let(:aws_stub) { double(:upload) }

  describe "upload" do
    let(:args) do
      {
        name: "the-filename"
      }
    end
    it "can upload text" do
      expect(aws_stub).to receive(:put).and_return("some path")
      response = described_class.new("SOME TEXT", aws_stub).upload(args)
      expect(response).to eq({name: "the-filename", url: "some path"})
    end

    let(:tempfile) { Tempfile.new }
    let(:file) { double(tempfile: tempfile, content_type: "text", original_filename: "fn") }

    it "can upload a file" do
      expect(aws_stub).to receive(:put).and_return("some path")
      response = described_class.new(file, aws_stub).upload
      expect(response).to eq({name: "fn", url: "some path"})
    end
  end
end
