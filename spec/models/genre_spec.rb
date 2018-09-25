require 'rails_helper'

RSpec.describe Genre, type: :model do
  before do 
    @genre = build(:genre)
  end

  describe "Genre" do
    it "is valid with a name" do
      expect(@genre.valid?).to eq(true) 
    end

    it "is invalid without a name ('')" do
      @genre.name = ''
      expect(@genre.valid?).to eq(false) 
    end

    it "is invalid without a name (nil)" do
      @genre.name = nil
      expect(@genre.valid?).to eq(false) 
    end
  end
end
