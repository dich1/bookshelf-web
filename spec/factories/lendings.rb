FactoryBot.define do
  factory :lending do
    book_id 1
    user_id 1
    memo "MyText"
    checkout_date "2018-05-01"
    return_date "2018-05-01"
  end
end
