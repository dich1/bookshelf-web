class Api::HistoriesController < ApplicationController
  before_action :set_history, only: [:update, :destroy]

  # GET /api/histories
  def index
    @histories = History.all
  end

  # POST /api/histories
  def create
    @history = History.new(history_params)

    if @history.save
      render :show, status: :created
    else
      render json: @history.errors, status: :unprocessable_entity
    end
  end

  # 履歴更新API
  # 
  # PATCH/PUT /api/histories/:id
  def update
    if @history.update(history_params)
      render :show, status: :ok, location: @history
    else
      render json: @history.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/histories/:id
  def destroy
    if @history.destroy
      head :no_content
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_history
      @history = History.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def history_params
      params.fetch(:history, {})
    end
end
