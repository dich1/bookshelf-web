class Genre < ApplicationRecord
  has_many :books
  validates :name, presence: true
end
