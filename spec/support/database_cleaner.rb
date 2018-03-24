RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner.clean_with :truncation  # clean DB of any leftover data
    DatabaseCleaner.strategy = :transaction # rollback transactions between each test
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end