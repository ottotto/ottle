class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all.order("FromDate DESC")
    @hash = Gmaps4rails.build_markers(Post.all) do |post, marker|
      marker.lat post.latitude
      marker.lng post.longitude
      marker.infowindow post.title
    end
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
    @post_attachments = @post.post_attachments.all
  end

  def new
   @post = Post.new
   @post_attachment = @post.post_attachments.build
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = Post.new(post_params)
    @post.user_id = current_user.id
    @tags = Post.tag_counts_on(:tags)
    
        respond_to do |format|
          if @post.save
            if params[:post_attachments]
              params[:post_attachments]['avatar'].each do |a|
                @post.post_attachments.create!(:avatar => a, :post_id => @post.id)
              end
            end
            format.html { redirect_to @post, notice: 'Post was successfully created.' }
            format.json { render :show, status: :created, location: @post }
          else
            format.html { render :new }
            format.json { render json: @post.errors, status: :unprocessable_entity }
          end
        end

  end
  def update
    respond_to do |format|
      if @post.update(post_params)
        if params[:post_attachments]
          params[:post_attachments]['avatar'].each do |a|
            @post.post_attachments.create!(:avatar => a, :post_id => @post.id)
          end
        end
        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json

  def tagged
    if params[:tag].present?
      @posts = Post.tagged_with(params[:tag])
    else
      @posts = Post.index
    end
  end
  def tag_cloud
    @tags = Post.tag_counts_on(:tags)
  end
  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_url, notice: 'Post was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit(:title, :description, :tag_list, :image, :FromDate, :ToDate, :address, :latitude, :longitude, post_attachments_attributes: [:id, :post_id, :avatar])
    end
end
