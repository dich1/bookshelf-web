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
  # @param [Object] books Bookモデルから取得した本一覧
  def get_books
    @hash = Hash.new { |h, k| h[k] = [] }
    @ary  = Array.new

    books = Book.all

    # TODO active_model_serializersでロジックを書く
    rending_count = 0
    books.each {|book| 
      # 1冊毎のステータスと返却予定日をチェックし設定する
      status = Book.statuses["safekeeping"]
      return_due_date = ''

      if is_lending(book)
        status = Book.statuses["lending"]
        return_due_date = book.histories.where.not(checkout_date: nil).where(return_date: nil).last.return_due_date
        rending_count += 1
      end
      
      hash_book = book.attributes
      hash_book["status"]          = status
      hash_book["return_due_date"] = return_due_date
      
      @ary << hash_book
    }

    @hash["books"] = @ary
    # TODO カウンターキャッシュにする
    total_count       = books.count
    safekeeping_count = total_count - rending_count
    # TODO historyのモデルから取得する情報にする
    @hash["total_count"]       = total_count
    @hash["rending_count"]     = rending_count
    @hash["safekeeping_count"] = safekeeping_count

    return @hash
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
