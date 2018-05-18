class CreateHistories < ActiveRecord::Migration[5.1]
  def change
    create_table :histories do |t|
      t.integer :book_id        , :null => false, comment: "本ID"
      t.integer :user_id        , :null => false, comment: "ユーザーID"
      t.date    :checkout_date  , comment: "貸出日"
      t.date    :return_due_date, comment: "返却予定日"
      t.date    :return_date    , comment: "返却日"

      t.timestamps
    end
    set_table_comment  :histories, "履歴"
    set_column_comment :histories, :id, "履歴ID"
  end
end
