class AddFromDateAndToDateToPost < ActiveRecord::Migration
  def change
    add_column :posts, :FromDate, :date
    add_column :posts, :ToDate, :date
  end
end
