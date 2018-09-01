# config valid for current version and patch releases of Capistrano
lock "~> 3.10.2"

set :application, "bookshelf-web"
set :repo_url, "git@github.com:dich1/bookshelf-web.git"
set :deploy_to, '/var/www/bookshelf-web'

# setting rbenv
set :rbenv_type, :user
set :rbenv_ruby, '2.4.2'
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
set :rbenv_map_bins, %w{rake gem bundle ruby rails}
set :rbenv_roles, :all

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')

# Default value for default_env is {}
# set :default_env, { 
#   path: "/opt/ruby/bin:$PATH",
#   AWS_ACCESS_KEY_ID: ENV['AWS_ACCESS_KEY_ID'],
#   AWS_SECRET_ACCESS_KEY: ENV['AWS_SECRET_ACCESS_KEY'],
#   S3_BUCKET_NAME: ENV['S3_BUCKET_NAME']
# }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
set :keep_releases, 3

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"

namespace :deploy do

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

  desc 'Restart application'
  task :restart do
    invoke 'puma:start'
  end

  # desc 'Upload database.yml'
  # task :upload do
    # on roles(:app) do |host|
      # if test "[ ! -d #{shared_path}/config ]"
      #   execute "mkdir -p #{shared_path}/config"
      # end
      # upload!('config/database.yml', "#{shared_path}/config/database.yml")
    # end
  # end

  desc 'rollback for docker'
  task :rollback_docker do
    on roles(:app) do
      within release_path do
        execute "cd /var/www/bookshelf-web/current && docker-compose down"
        execute "sudo chown -R deploy:deploy /var/www/bookshelf-web/releases"
        execute "sudo service docker restart"
      end
    end
  end

  desc 'prepare for docker'
  task :prepare_docker do
    on roles(:app) do
      within release_path do
        execute "sudo chown -R deploy:deploy /var/www/bookshelf-web/releases"
        # TODO git管理対象にする
        upload!('.env', "/var/www/bookshelf-web/current/.env")

        execute "cd /var/www/bookshelf-web/current && docker-compose down"
        execute "cd /var/www/bookshelf-web/current && docker system prune -f"
        # execute "cd /var/www/bookshelf-web/current && docker rmi -f `docker images -aq`"
        execute "sudo service docker restart"
      end
    end
  end

  desc 'start for docker'
  task :start_docker do
    on roles(:app) do
      within release_path do
        # TODO git管理対象にする
        upload!('config/database.yml', "/var/www/bookshelf-web/current/config/database.yml")
        upload!('.env', "/var/www/bookshelf-web/current/.env")

        execute "cd /var/www/bookshelf-web/current && docker-compose build"
        execute "cd /var/www/bookshelf-web/current && docker-compose up -d"
        execute "cd /var/www/bookshelf-web/current && docker-compose run --rm web rake db:create db:migrate"
      end
    end
  end

  before :finishing_rollback, 'deploy:rollback_docker'
  # before :starting, 'deploy:upload'
  after :finishing, 'deploy:prepare_docker'
  after :finishing, 'deploy:cleanup'
  after :finished, 'deploy:start_docker'

end
