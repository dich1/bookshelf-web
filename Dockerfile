FROM ruby:2.4.2
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs graphviz
RUN mkdir /bookshelf-web
WORKDIR /bookshelf-web
COPY Gemfile /bookshelf-web/Gemfile
COPY Gemfile.lock /bookshelf-web/Gemfile.lock
RUN bundle install
COPY . /bookshelf-web

RUN mkdir -p tmp/sockets
RUN mkdir -p tmp/pids

ENV DISABLE_DATABASE_ENVIRONMENT_CHECK 1

EXPOSE 3000
CMD RAILS_ENV=${RAILS_ENV} bundle exec pumactl start