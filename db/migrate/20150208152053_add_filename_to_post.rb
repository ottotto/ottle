class AddFilenameToPost < ActiveRecord::Migration
  def change
    add_column :posts, :file_name, :string
  end
end
