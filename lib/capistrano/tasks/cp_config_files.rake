namespace :deploy do
  desc "Upload secrets.yml to the shared/config directory."
  task :cp_config_files do
    unless File.exist?('tmp/secrets.yml')
      secrets = { fetch(:stage).to_s =>
        { 'secret_key_base' => SecureRandom.hex(64) } }
      File.open('tmp/secrets.yml', 'w') do |f|
        f.write secrets.to_yaml
      end
    end

    on roles(:app) do
      unless test "[ -f #{shared_path}/config/secrets.yml ]"
        unless test "[ -d #{shared_path}/config ]"
          execute "/bin/mkdir -p #{shared_path}/config/"
        end
        upload! "tmp/secrets.yml", "#{shared_path}/config/secrets.yml"
      end
    end
  end
end
