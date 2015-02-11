class AddImagecontenttypeToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :image_content_type, :string
  end
end
