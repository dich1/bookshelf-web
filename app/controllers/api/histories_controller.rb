class Api::HistoriesController < ApplicationController
  before_action :set_api_history, only: [:show, :edit, :update, :destroy]

  # GET /api/histories
  # GET /api/histories.json
  def index
    @api_histories = Api::History.all
  end

  # GET /api/histories/1
  # GET /api/histories/1.json
  def show
  end

  # GET /api/histories/new
  def new
    @api_history = Api::History.new
  end

  # GET /api/histories/1/edit
  def edit
  end

  # POST /api/histories
  # POST /api/histories.json
  def create
    @api_history = Api::History.new(api_history_params)

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

  # PATCH/PUT /api/histories/1
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

  # DELETE /api/histories/1
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
      @api_history = Api::History.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def api_history_params
      params.fetch(:api_history, {})
    end
end
