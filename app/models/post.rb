class Post < ActiveRecord::Base
	acts_as_taggable
	acts_as_taggable_on :tag_list

	has_many :post_attachments
	accepts_nested_attributes_for :post_attachments
end