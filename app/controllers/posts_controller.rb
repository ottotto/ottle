class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all
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
    if @post.save
      if params[:post_attachments]
        params[:post_attachments]['avatar'].each {|avatar|
          @post.post_attachments.create!(:avatar => avatar, :post_id => @post.id)
        }
      end
      flash[:notice] = "Your post has been created."
      redirect_to @post
    else
      flase[:alert] = "Something went wrong."
      render :new
    end
  end
  def update
    if @post.update(post_params)
      if params[:post_attachments]
        params[:post_attachments]['avatar'].each {|avatar|
          @post.post_attachments.create!(:avatar => avatar, :post_id => @post.id)
        }
      end
      flash[:notice] = "Your post has been created."
      redirect_to @post
    else
      flase[:alert] = "Something went wrong."
      render :edit
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
      params.require(:post).permit(:title, :description, :tag_list, :image, post_attachments_attributes: [:id, :post_id, :avatar])
    end
end
