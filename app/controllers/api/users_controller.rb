# ユーザー関連APIコントローラークラス
#
# 返却値がある場合、JSON形式で返す
class Api::UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  # GET /api/users
  def index
    if get_user
      render :json => get_user
    else
      render :json => {}, status: :unauthorized
    end
  end

  # GET /api/users/:id
  def show
    render :json => @user
  end

  # GET /api/users/new
  def new
    @user = User.new
  end

  # GET /api/users/1/edit
  def edit
  end

  # POST /api/users
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /api/users/:id
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /api/users/:id
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    def get_user
      return { user_id: current_user.id, user_name: current_user.name, user_image: current_user.image} if user_signed_in?
    end
    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.fetch(:user, {})
    end
end
