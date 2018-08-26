class Lending < ApplicationRecord
  belongs_to :book, class_name: 'Book', foreign_key: 'book_id', optional: true
  validates :user_id  , presence: true
  
  # 本を返却する
  # 返却日時を記録することで返したことを表す。
  def return_book
    update returned_on: Date.current
  end
end
