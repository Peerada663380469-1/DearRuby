FROM httpd:2.4

RUN sed -i \
      -e 's|^#\(LoadModule proxy_module .*\)|\1|' \
      -e 's|^#\(LoadModule proxy_http_module .*\)|\1|' \
      /usr/local/apache2/conf/httpd.conf \
 && echo "Include conf/extra/idor.conf" >> /usr/local/apache2/conf/httpd.conf

COPY idor.conf /usr/local/apache2/conf/extra/idor.conf
