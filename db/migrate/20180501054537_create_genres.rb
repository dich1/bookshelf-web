class CreateGenres < ActiveRecord::Migration[5.1]
  def change
    create_table :genres do |t|
      t.string :name, :null => false, comment: "ジャンル名"

      t.timestamps
    end
    set_table_comment  :genres, "ジャンル"
    set_column_comment :genres, :id, "ジャンルID"
  end
end
