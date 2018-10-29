class Book < ApplicationRecord
  has_many :genres
  has_many :lendings
  accepts_nested_attributes_for :lendings
  validates :title, presence: true
  validates :image, presence: true
  enum status: {safekeeping: 0, lending: 1}
  mount_uploader :image, ImageUploader
  scope :per_newest, -> (number){page(number).per(PER).order("updated_at DESC")}
  scope :keyword, -> (keyword){ransack(title_cont: keyword).result}
  scope :lending_books, -> {where(id: Lending.select("book_id").lendings)}
  scope :safekeeping_books, -> {where.not(id: Lending.select("book_id").lendings)}

  class << self
    # 本一覧
    # @param          [Hash]   params  パラメータ
    # @optioin params [String] :page   ページ
    # @optioin params [String] :status ステータス
    # @optioin params [String] :q      検索文字列
    # @return         [Object]         ステータス毎
    # @return         [Object]         キーワード毎
    # @return         [Object]         最新ページ毎
    def books(params)
      page = params[:page].to_i ||= 1
      return by_status(page, params[:status].to_i) if params[:status].present?
      return keyword(params[:q]).per_newest(page) if params[:q].present?
      return per_newest(page) if params[:q].blank?
    end

    # ステータス毎
    # @param  [Numeric] page   ページ
    # @param  [Numeric] status ステータス
    # @return [Object]         貸出中本一覧
    # @return [Object]         保管中本一覧
    private
      def by_status(page, status)
        return lending_books.per_newest(page) if status == statuses["lending"]
        return safekeeping_books.per_newest(page) if status == statuses["safekeeping"]
      end
  end
end
