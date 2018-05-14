Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    resources :books, only: [:index, :create, :update, :destroy]
    resources :memos, only: [:index, :create, :update, :destroy]
    resources :histories, only: [:index, :create, :update, :destroy]
  end
end
