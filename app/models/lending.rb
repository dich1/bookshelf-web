class Lending < ApplicationRecord
  belongs_to :book, class_name: 'Book', foreign_key: 'book_id', optional: true
  validates :user_id  , presence: true
end
