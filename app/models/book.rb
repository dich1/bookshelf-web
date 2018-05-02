class Book < ApplicationRecord
  has_many :genres
  has_many :histories
end
