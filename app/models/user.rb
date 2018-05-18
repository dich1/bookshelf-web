class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  def self.find_for_oauth(auth)
    user = User.where(uid: auth.uid, provider: auth.provider).first

    unless user
      user = User.create(
        email:    auth.info.email,
        password: Devise.friendly_token[0, 20],
        name:     auth.info.name,
        image:    auth.info.image,
        uid:      auth.uid,
        provider: auth.provider
      )
    end
    user
  end

  private
  def self.dummy_email(auth)
    "#{auth.uid}-#{auth.provider}@example.com"
  end
end
