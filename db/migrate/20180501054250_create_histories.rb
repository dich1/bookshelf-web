class CreateHistories < ActiveRecord::Migration[5.1]
  def change
    create_table :histories do |t|
      t.integer :book_id
      t.integer :user_id
      t.text :memo
      t.date :checkout_date
      t.date :return_date

      t.timestamps
    end
  end
end
