# 本関連APIコントローラークラス
#
# 返却値がある場合、JSON形式で返す
class Api::BooksController < ApplicationController
  protect_from_forgery :except => [:create, :destroy]
  before_action :set_book, only: [:update, :destroy]

  # 本一覧取得API
  # 
  # GET /api/books
  def index
    @books = Book.books(params)
    set_counts
    render :json => @books, meta: @counts
  end

  # 本登録API。同時に借りる場合、lendingsにユーザーIDと返却日を登録する
  #
  # POST /api/books
  def create
    @book = Book.new(book_params)

    if @book.save
      render json: {}, status: :created
    else
      render json: @book.errors, status: :unprocessable_entity 
    end
  end

  # 本更新API
  #
  # PATCH/PUT /api/books/:id
  def update
    if @book.update(book_params)
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
    end

    def set_counts
      total = Book.all.size
      lendings = Lending.lendings.count
      safekeepings = total - lendings
      @counts = { total: total, readings: lendings, safekeepings: safekeepings}
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def book_params
      params.fetch(:book, {}).permit(:title, :image, :genre_id, lendings_attributes: [:id, :book_id, :user_id, :checkouted_on, :return_scheduled_on, :returned_on, :_destroy])
    end
end
