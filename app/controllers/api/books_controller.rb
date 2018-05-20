# 本関連APIコントローラークラス
#
# 返却値がある場合、JSON形式で返す
class Api::BooksController < ApplicationController
  before_action :set_book, only: [:update, :destroy]

  # 本一覧取得API
  # 
  # GET /api/books
  def index
    page = params[:page].to_i ||= 1

    @books = Book.per_newest(page)
    # TODO 総本数、貸出中本数、保管中本数のフィールドを追加する
    
    render :json => @books
  end

  # 本登録API。同時に借りる場合、historiesにユーザーIDと返却日を登録する
  #
  # POST /api/books
  def create
    @book = Book.new(book_params)

    if @book.save
      head :created
    else
      render json: @book.errors, status: :unprocessable_entity 
    end
  end

  # TODO 適切なAPI名にする。
  # 本更新API。返却情報を更新する場合、historiesの返却日予定日または返却日を更新する
  #
  # PATCH/PUT /api/books/:id
  def update
     # TODO active_model_serializersでレスポンスを設定する
    hash_book_params = book_params.to_h
    # hash_book_params["histories_attributes"][0]["id"] = Book.lending_history_id(params[:id])
    # TODO scopeにする
    hash_book_params["histories_attributes"][0]["id"] = Book.find(params[:id]).histories.where.not(checkout_date: nil, return_due_date: nil).where(return_date: nil).last.id
    # TODO 保管中だった場合の処理を追加する
    puts hash_book_params
    if @book.update(hash_book_params)
      head :no_content
    else
      render json: @book.errors, status: :unprocessable_entity 
    end
  end

  # 本削除API。関連データは削除しない
  #
  # DELETE /api/books/:id
  def destroy
    @book.destroy
    head :no_content 
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_book
      @book = Book.find(params[:id])
      # @book = Book.find(params[:id]).histories.where.not(checkout_date: nil, return_due_date: nil).where(return_date: nil).last
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def book_params
      params.fetch(:book, {}).permit(:title, :image, :genre_id, histories_attributes: [:id, :book_id, :user_id, :checkout_date, :return_due_date, :return_date, :_destroy])
    end
end
