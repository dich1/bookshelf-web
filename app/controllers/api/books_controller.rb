# 本関連APIコントローラークラス
#
# 返却値がある場合、JSON形式で返す
class Api::BooksController < ApplicationController
  before_action :set_book, only: [:update, :destroy]
  # TODO ENUMにする。用途の範囲が広くなったら外に切り出す。
  LENDING     = 0
  SAFEKEEPING = 1

  # 返却値をラップするための変数を生成
  def initialize
    @ary  = Array.new
    @hash = Hash.new { |h, k| h[k] = [] }
  end

  # 本一覧取得API
  # GET /api/books
  def index
    @books = Book.all

    set_books_response(@books)

    @hash["books"] = @ary
    
    render :json => @hash
  end

  # POST /api/books
  def create
    @book = Book.new(book_params)

    if @book.save
      # historiesにユーザーIDと返却日を登録する
      render :show, status: :created, location: @book 
    else
      render json: @book.errors, status: :unprocessable_entity 
    end
  end

  # PATCH/PUT /api/books/:id
  def update
    if @book.update(book_params)
      render :show, status: :ok, location: @book 
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
      params.fetch(:book, {})
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

    # 本の一覧として返す返却値を設定する
    # 
    # @param [Object] books Bookモデルから取得した本一覧
    def set_books_response(books)
      books.each {|book| 
        # 1冊毎の状態と返却予定日を設定する
        status = SAFEKEEPING
        return_date = ''
        if is_lending(book)
          status = LENDING
          return_date = book.histories.where.not(checkout_date: nil, return_date: nil).last.return_date
        end
        
        hash_book = book.attributes
        hash_book["status"] = status;
        hash_book["return_date"] = return_date;
        @ary << hash_book
      }
    end
end
