class Book < ApplicationRecord
  has_many :genres
  has_many :histories
  validates :title  , presence: true
  validates :image  , presence: true
end
