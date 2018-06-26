FROM alpine:latest

RUN apk update \
  && apk --no-cache add curl ca-certificates

COPY root /var/spool/cron/crontabs/root
CMD crond -l 2 -f
