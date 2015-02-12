CarrierWave.configure do |config|
  config.dropbox_app_key = "lpsy1d4w8ey8ozr"
  config.dropbox_app_secret = ENV["APP_SECRET"]
  config.dropbox_access_token = "6yio3k16cldj2fbt"
  config.dropbox_access_token_secret = ENV["ACCESS_TOKEN_SECRET"]
  config.dropbox_user_id = ENV["USER_ID"]
  config.dropbox_access_type = "app_folder"
end

