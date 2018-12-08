FROM ruby:2.4.2
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev apt-transport-https vim graphviz xsltproc xvfb wkhtmltopdf fonts-ipafont mysql-client xpdf
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - && apt-get install -y nodejs
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn
RUN mkdir /bookshelf-web
WORKDIR /bookshelf-web
COPY Gemfile /bookshelf-web/Gemfile
COPY Gemfile.lock /bookshelf-web/Gemfile.lock
RUN bundle install
COPY . /bookshelf-web

RUN mkdir -p tmp/sockets
RUN mkdir -p tmp/pids

EXPOSE 3000
CMD RAILS_ENV=${RAILS_ENV} bundle exec pumactl start