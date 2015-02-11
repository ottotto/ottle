class AddImagefilesizeToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :image_file_size, :integer
  end
end
