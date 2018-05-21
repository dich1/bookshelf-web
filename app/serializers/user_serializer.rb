class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :image
end
