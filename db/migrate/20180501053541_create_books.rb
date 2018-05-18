class CreateBooks < ActiveRecord::Migration[5.1]
  def change
    create_table :books do |t|
      t.string  :title   , :null => false, comment: "タイトル"
      t.string  :image   , :null => false, comment: "画像"
      t.integer :genre_id, comment: "ジャンルID"

      t.timestamps
    end
    set_table_comment  :books, "本"
    set_column_comment :books, :id, "本ID"
  end
end
