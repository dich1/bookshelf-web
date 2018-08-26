class Api::LendingsController < ApplicationController
  before_action :set_lending, only: [:update, :destroy]

  # GET /api/lendings
  def index
    @lendings = Lending.all
  end

  # POST /api/lendings
  def create
    @lending = Lending.new(lending_params)

    if @lending.save
      render :show, status: :created
    else
      render json: @lending.errors, status: :unprocessable_entity
    end
  end

  # 貸出更新API
  # 
  # PATCH/PUT /api/lendings/:id
  def update
    if @lending.update(lending_params)
      render :show, status: :ok, location: @lending
    else
      render json: @lending.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/lendings/:id
  def destroy
    @lending.destroy
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_lending
      @lending = Lending.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def lending_params
      params.fetch(:lending, {})
    end
end
