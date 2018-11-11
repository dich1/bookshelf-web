FROM nginx
ENV LETSENCRYPT_HOSTS bookshelf.tech
ENV LETSENCRYPT_MAIL daich125912@gmail.com
ENV LETSENCRYPT_SUBJECT "/C=JP/ST=Tokyo/L=Shinjuku/CN=default"
RUN rm -f /etc/nginx/conf.d/*
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf && apt-get update -q && apt-get install -y -q \
  certbot \
  cron \
  curl \
  openssl
RUN service cron start
RUN echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew --post-hook=\"service nginx reload\"" > /etc/crontab
ADD nginx.conf /etc/nginx/conf.d/bookshelf-web.conf
EXPOSE 80
EXPOSE 443
COPY start.sh /etc/nginx/start.sh
RUN chmod +x /etc/nginx/start.sh
CMD /etc/nginx/start.sh
