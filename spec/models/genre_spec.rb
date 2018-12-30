require 'rails_helper'

RSpec.describe Genre, type: :model do
  before do 
    @genre = Genre.new()
  end

  describe "Genre" do
    it "is valid with a name" do
      @genre.name = 'TEST NAME'
      expect(@genre.valid?).to eq(true)
    end

    it "is uniqueness a name" do
      Genre.create(name: 'TEST NAME')
      @genre.name = 'TEST NAME'
      expect(@genre.invalid?).to eq(true)
    end

    it "is has many books" do
      # expect(@genre.books).to match_array books
    end

    it "is not has many books" do

    end

    it "is invalid without a name number" do
      @genre.name = 1
      expect(@genre.valid?).to eq(true)
    end

    it "is invalid without a name ('')" do
      @genre.name = ''
      expect(@genre.invalid?).to eq(true) 
    end

    it "is invalid without a name (nil)" do
      @genre.name = nil
      expect(@genre.invalid?).to eq(true) 
    end
  end
end
