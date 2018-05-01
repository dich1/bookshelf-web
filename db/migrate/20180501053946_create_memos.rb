class CreateMemos < ActiveRecord::Migration[5.1]
  def change
    create_table :memos do |t|
      t.integer :book_id
      t.integer :user_id
      t.text :memo

      t.timestamps
    end
  end
end
