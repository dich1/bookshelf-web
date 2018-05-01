class CreateBooks < ActiveRecord::Migration[5.1]
  def change
    create_table :books do |t|
      t.string :title, :null => false
      t.string :image, :null => false
      t.integer :genre_id

      t.timestamps
    end
  end
end
