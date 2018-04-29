# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks

task :create_erd do
  sh 'bin/rake erd attributes=foreign_keys,primary_keys,content,timestamp sort=false filename=bookshelf-erd filetype=pdf'
end

task :create_classd do
  sh 'yard doc'
  sh 'yard graph --full -f bookshelf-classd.dot'
  sh 'dot -Tpng bookshelf-classd.dot -o bookshelf-classd.png'
end

task :after_migrate do
  Rake::Task[:create_erd].invoke
  Rake::Task[:create_classd].invoke
end

Rake::Task['db:migrate'].enhance do
  Rake::Task[:after_migrate].invoke
end
