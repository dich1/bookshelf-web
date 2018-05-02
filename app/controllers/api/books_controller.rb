class Api::BooksController < ApplicationController
  before_action :set_api_book, only: [:update, :destroy]

  def initialize
    @hash = Hash.new { |h, k| h[k] = [] }
  end

  # GET /api/books.json
  def index
    @api_books = Book.all
    @hash["books"] = @api_books
    
    render :json => @hash
  end

  # POST /api/books.json
  def create
    @api_book = Book.new(api_book_params)

    respond_to do |format|
      if @api_book.save
        format.html { redirect_to @api_book, notice: 'Book was successfully created.' }
        format.json { render :show, status: :created, location: @api_book }
      else
        format.html { render :new }
        format.json { render json: @api_book.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /api/books/1.json
  def update
    respond_to do |format|
      if @api_book.update(api_book_params)
        format.html { redirect_to @api_book, notice: 'Book was successfully updated.' }
        format.json { render :show, status: :ok, location: @api_book }
      else
        format.html { render :edit }
        format.json { render json: @api_book.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /api/books/1.json
  def destroy
    @api_book.destroy
    respond_to do |format|
      format.html { redirect_to api_books_url, notice: 'Book was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_book
      @api_book = Book.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def api_book_params
      params.fetch(:api_book, {})
    end
end
