class PostAttachment < ActiveRecord::Base

	mount_uploader :avatar, AvatarUploader
	belongs_to :post
	validates :post, presence: true
end