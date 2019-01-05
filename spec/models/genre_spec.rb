require 'rails_helper'

RSpec.describe Genre, type: :model do
  let(:genre) { Genre.new(params) }
  let(:params) { { name: 'TEST NAME' } }

  describe "Genre" do
    it "is valid with a name" do
      expect(genre.valid?).to eq(true)
    end

    it "is uniqueness a name" do
      Genre.create(name: 'TEST NAME')
      expect(genre.invalid?).to eq(true)
    end

    it "is has many books" do
      books = []
      1.upto(2){|number|
        books << Book.create(title: 'title' + number.to_s, image: 'image' + number.to_s)
      }
      genre.books = books
      expect(genre.books).to match_array books
    end

    it "is not has many books" do
      expect(genre.books.size).to eq(0)
    end

    it "is invalid without a name number" do
      genre.name = 1
      expect(genre.valid?).to eq(true)
    end

    it "is invalid without a name ('')" do
      genre.name = ''
      expect(genre.invalid?).to eq(true)
    end

    it "is invalid without a name (nil)" do
      genre.name = nil
      expect(genre.invalid?).to eq(true)
    end
  end
end
