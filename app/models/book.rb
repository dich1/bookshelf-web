class Book < ApplicationRecord
  has_many :genres
  has_many :lendings
  accepts_nested_attributes_for :lendings
  validates :title, presence: true
  validates :image, presence: true
  enum status: {safekeeping: 0, lending: 1}
  mount_uploader :image, ImageUploader
  scope :per_newest, -> (number){page(number).per(PER).order("updated_at DESC")}
  scope :keyword, -> (keyword){ransack(title_cont: keyword).result}

  class << self
    def books(params)
      page = params[:page].to_i ||= 1
      params[:q] ? keyword(params[:q]).per_newest(page) : per_newest(page)
    end
  end
end
