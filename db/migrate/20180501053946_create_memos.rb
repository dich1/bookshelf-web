class CreateMemos < ActiveRecord::Migration[5.1]
  def change
    create_table :memos do |t|
      t.integer :book_id, :null => false, comment: "本ID"
      t.integer :user_id, :null => false, comment: "ユーザーID"
      t.text    :memo   , comment: "メモ"

      t.timestamps
    end
    set_table_comment  :memos, "メモ"
    set_column_comment :memos, :id, "ID"
  end
end
