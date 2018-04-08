FROM ruby:2.4.2
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /bookshelf-web
WORKDIR /bookshelf-web
COPY Gemfile /bookshelf-web/Gemfile
COPY Gemfile.lock /bookshelf-web/Gemfile.lock
RUN bundle install
COPY . /bookshelf-web
