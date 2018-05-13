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
    
    @books = Book.new.get_books(page)
    
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

  # 本更新API。返却情報を更新する場合、historiesの返却日予定日または返却日を更新する
  #
  # PATCH/PUT /api/books/:id
  def update
    if @book.update(book_params)
      head :no_content
    else
      render json: @book.errors, status: :unprocessable_entity 
    end
  end

  # DELETE /api/books/:id
  def destroy
    @book.destroy
      head :no_content 
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_book
      @book = Book.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def book_params
      params.fetch(:book, {}).permit(:title, :image, :genre_id, histories_attributes: [:id, :book_id, :user_id, :checkout_date, :return_due_date, :return_date, :_destroy])
    end
end
