class Book < ApplicationRecord
  has_many :genres
  has_many :histories
  accepts_nested_attributes_for :histories
  validates :title, presence: true
  validates :image, presence: true
  enum status: {lending: 0, safekeeping: 1}
  mount_uploader :image, ImageUploader

  # 本の一覧として返す返却値を設定する
  # 
  # @param  [Integer] page  ページ番号
  # @return [Object]  books 本一覧
  def get_books(page)
    @ary  = Array.new

    books = Book.page(page).per(PER).order("updated_at DESC")

    # TODO active_model_serializersでロジックを書く
    books.each {|book| 
      # 1冊毎のステータスと返却予定日をチェックし設定する
      status = Book.statuses["safekeeping"]
      return_due_date = ''

      if is_lending(book)
        status = Book.statuses["lending"]
        return_due_date = book.histories.where.not(checkout_date: nil).where(return_date: nil).last.return_due_date
      end
      
      hash_book = book.attributes
      hash_book["status"]          = status
      hash_book["return_due_date"] = return_due_date
      
      @ary << hash_book
    }

    return @ary
  end

  # 貸出中かを判定する
  # 
  # @param  [Object]  book 本一覧の中の1冊
  # @return [Boolean] 貸出中の場合         :true 
  # @return [Boolean] それ以外の場合(保管中):false
  def is_lending(book)
    if book.histories.where.not(checkout_date: nil).where(return_date: nil).last.nil?
      return false
    end

    return true
  end
end
