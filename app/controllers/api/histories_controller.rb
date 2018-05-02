class Api::HistoriesController < ApplicationController
  before_action :set_api_history, only: [:update, :destroy]

  # GET /api/histories.json
  def index
    @api_histories = History.all
  end

  # POST /api/histories.json
  def create
    @api_history = History.new(api_history_params)

    respond_to do |format|
      if @api_history.save
        format.html { redirect_to @api_history, notice: 'History was successfully created.' }
        format.json { render :show, status: :created, location: @api_history }
      else
        format.html { render :new }
        format.json { render json: @api_history.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /api/histories/1.json
  def update
    respond_to do |format|
      if @api_history.update(api_history_params)
        format.html { redirect_to @api_history, notice: 'History was successfully updated.' }
        format.json { render :show, status: :ok, location: @api_history }
      else
        format.html { render :edit }
        format.json { render json: @api_history.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /api/histories/1.json
  def destroy
    @api_history.destroy
    respond_to do |format|
      format.html { redirect_to api_histories_url, notice: 'History was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_history
      @api_history = History.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def api_history_params
      params.fetch(:api_history, {})
    end
end
