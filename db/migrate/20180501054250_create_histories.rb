class CreateHistories < ActiveRecord::Migration[5.1]
  def change
    create_table :histories do |t|
      t.integer :book_id, :null => false
      t.integer :user_id, :null => false
      t.date :checkout_date
      t.date :return_due_date
      t.date :return_date

      t.timestamps
    end
  end
end
