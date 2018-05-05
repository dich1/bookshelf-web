class Book < ApplicationRecord
  has_many :genres
  has_many :histories
  validates :title, presence: true
  validates :image, presence: true

  # 本の一覧として返す返却値を設定する
  # 
  # @param [Object] books Bookモデルから取得した本一覧
  def get_books
    @ary  = Array.new
    # TODO 定数にする
    per_page_books = Book.last(20)
    per_page_books.each {|book| 
      # 1冊毎の状態と返却予定日を設定する
      # TODO 定数にする
      status = 1
      return_date = ''
      if is_lending(book)
        # TODO 定数にする
        status = 0
        return_date = book.histories.where.not(checkout_date: nil, return_date: nil).last.return_date
      end
      
      hash_book = book.attributes
      hash_book["status"] = status
      hash_book["return_date"] = return_date
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
