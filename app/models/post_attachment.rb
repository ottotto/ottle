class PostAttachment < ActiveRecord::Base

	mount_uploader :avatar, AvatarUploader
	belongs_to :post
	validates_with AttachmentSizeValidator, :attributes => :avatar, :less_than => 1.megabytes
end