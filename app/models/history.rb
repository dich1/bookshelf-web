class History < ApplicationRecord
  belongs_to :book, class_name: 'Book', foreign_key: 'book_id'
  validates :book_id  , presence: true
  validates :user_id  , presence: true
end
