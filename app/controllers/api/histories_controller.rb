class Api::HistoriesController < ApplicationController
  before_action :set_history, only: [:update, :destroy]

  # GET /api/histories.json
  def index
    @histories = History.all
  end

  # POST /api/histories.json
  def create
    @history = History.new(history_params)

    respond_to do |format|
      if @history.save
        format.json { render :show, status: :created, location: @history }
      else
        format.json { render json: @history.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /api/histories/1.json
  def update
    respond_to do |format|
      if @history.update(history_params)
        format.json { render :show, status: :ok, location: @history }
      else
        format.json { render json: @history.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /api/histories/1.json
  def destroy
    @history.destroy
    respond_to do |format|
      format.json { head :no_content }
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
