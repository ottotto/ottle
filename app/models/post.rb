class Post < ActiveRecord::Base
	if Rails.env.development? 
		has_attached_file :image, :styles => { :medium => "500x>", :thumb => "100x100>" }, :default_url => "default.jpg",
			dependent: :destroy

	else
		has_attached_file :image, :styles => { :medium => "500x>", :thumb => "100x100>" }, :default_url => "default.jpg",
		    :storage => :dropbox,
	    	:dropbox_credentials => Rails.root.join("config/dropbox.yml"),
	    	:path => ":style/:id_:filename",
	    	dependent: :destroy
	end
  	validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/
  	validates_attachment_presence :image
  	#validates :title, :description, presence: true
  	validates :address, presence: true

  	geocoded_by :address
  	after_validation :geocode, if: -> (post){post.address.present? and post.address_changed?}

	acts_as_taggable
	acts_as_taggable_on :tag_list

	has_many :post_attachments, dependent: :destroy
	accepts_nested_attributes_for :post_attachments

	validate :image_size_validation, :if => "image?"

	def image_size_validation
	    if image.size > 2.megabytes
	      errors.add(:base, "Image should be less than 2MB")
	    end
	end

end