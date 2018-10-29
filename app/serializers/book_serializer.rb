class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :image, :genre_id, :status, :return_scheduled_on, :created_at, :updated_at

  def image
    object[:image]
  end

  def genre_id
    object[:genre_id] || ""
  end

  def status
    is_lending(object) ? Book.statuses["lending"] : Book.statuses["safekeeping"]
  end

  def return_scheduled_on
    object[:return_scheduled_on] || ""
  end

  private
    # 貸出中かを判定する
    # @param  [Object]  book 本一覧の中の1冊
    # @return [Boolean] 貸出中の場合:true それ以外の場合(保管中):false
    def is_lending(book)
      return book.lendings.where.not(checkouted_on: nil).where(returned_on: nil).last
    end
end
