# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks

task 'after_migrate' do
  sh 'bin/rake erd attributes=foreign_keys,primary_keys,content,timestamp sort=false filename=erd filetype=pdf'
end

Rake::Task['db:migrate'].enhance do
  Rake::Task['after_migrate'].invoke
end
