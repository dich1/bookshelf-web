class History < ApplicationRecord
  belongs_to :book
  validates :book_id  , presence: true
  validates :user_id  , presence: true
  validates :checkout_date  , presence: true
end
