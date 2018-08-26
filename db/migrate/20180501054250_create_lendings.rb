class CreateLendings < ActiveRecord::Migration[5.1]
  def change
    create_table :lendings do |t|
      t.integer :book_id        , :null => false, comment: "本ID"
      t.integer :user_id        , :null => false, comment: "ユーザーID"
      t.date    :checkout_date  , comment: "貸出日"
      t.date    :return_due_date, comment: "返却予定日"
      t.date    :return_date    , comment: "返却日"

      t.timestamps
    end
    set_table_comment  :lendings, "貸出"
    set_column_comment :lendings, :id, "貸出ID"
  end
end
