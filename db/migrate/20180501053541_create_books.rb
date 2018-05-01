class CreateBooks < ActiveRecord::Migration[5.1]
  def change
    create_table :books do |t|
      t.string :title
      t.string :image
      t.integer :genre_id

      t.timestamps
    end
  end
end
