FactoryBot.define do
  factory :lending do
    book_id 1
    user_id 1
    memo "MyText"
    checkouted_on "2018-05-01"
    returned_on "2018-05-01"
  end
end
