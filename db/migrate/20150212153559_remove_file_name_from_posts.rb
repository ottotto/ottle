class RemoveFileNameFromPosts < ActiveRecord::Migration
  def change
    remove_column :posts, :file_name, :string
  end
end
