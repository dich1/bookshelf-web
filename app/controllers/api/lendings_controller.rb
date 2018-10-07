class Api::LendingsController < ApplicationController
  protect_from_forgery :except => [:create]
  before_action :set_book, only: [:index, :create]
  before_action :set_lending, only: [:update, :destroy]

  # GET /api/books/:book_id/lendings
  def index
    @lendings = @book.lendings.all
    
    render :json => @lendings
  end

  # POST /api/books/:book_id/lendings
  def create
    @lending = @book.lendings.new(lending_params)

    if @lending.save
      head :created
    else
      render json: @lending.errors, status: :unprocessable_entity
    end
  end

  # 貸出更新API
  # 
  # PATCH/PUT /api/lendings/:id
  def update
    if @lending.update(lending_params)
      head :no_content
    else
      render json: @lending.errors, status: :unprocessable_entity
    end
  end

  # 貸出削除API
  #
  # DELETE /api/lendings/:id
  def destroy
    @lending.return_book
    head :no_content
  end

  private
    def set_book
      @book = Book.find(params[:book_id])
    end
  
    # Use callbacks to share common setup or constraints between actions.
    def set_lending
      @lending = Lending.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def lending_params
      params.require(:lending).permit(:book_id, :user_id, :checkouted_on, :return_scheduled_on)
    end
end
