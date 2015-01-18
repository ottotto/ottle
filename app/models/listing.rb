class Listing < ActiveRecord::Base
	if Rails.env.development? 
		as_attached_file :image, :styles => { :medium => "500x>", :thumb => "100x100>" }, :default_url => "default.jpg"
	else
		has_attached_file :image, :styles => { :medium => "500x>", :thumb => "100x100>" }, :default_url => "default.jpg",
		    :storage => :dropbox,
	    	:dropbox_credentials => Rails.root.join("config/dropbox.yml"),
	    	:path => ":style/:id_:filename"
	end
  	validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/
end
