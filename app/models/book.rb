class Book < ApplicationRecord
  has_many :genres
  has_many :lendings
  accepts_nested_attributes_for :lendings
  validates :title, presence: true
  validates :image, presence: true
  enum status: {safekeeping: 0, lending: 1}
  mount_uploader :image, ImageUploader
  scope :per_newest, -> (number){page("?").per(PER).order("updated_at DESC")}
end
