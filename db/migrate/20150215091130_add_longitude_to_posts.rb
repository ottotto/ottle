class AddLongitudeToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :longitude, :float
  end
end
