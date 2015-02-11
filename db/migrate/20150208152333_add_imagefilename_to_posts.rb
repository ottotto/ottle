class AddImagefilenameToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :image_file_name, :string
  end
end
