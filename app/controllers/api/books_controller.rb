# 本関連APIコントローラークラス
#
# 返却値がある場合、JSON形式で返す
class Api::BooksController < ApplicationController
  before_action :set_book, only: [:update, :destroy]

  def initialize
    @hash = Hash.new { |h, k| h[k] = [] }
  end

  # 本一覧取得API
  # GET /api/books
  def index
    @api_books = Book.all
    @hash["books"] = @api_books
    
    render :json => @hash
  end

  # POST /api/books
  def create
    @book = Book.new(book_params)

    respond_to do |format|
      if @book.save
        format.json { render :show, status: :created, location: @book }
      else
        format.json { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /api/books/:id
  def update
    respond_to do |format|
      if @book.update(book_params)
        format.json { render :show, status: :ok, location: @book }
      else
        format.json { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /api/books/:id
  def destroy
    @book.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_book
      @book = Book.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def book_params
      params.fetch(:book, {})
    end
    end
end
