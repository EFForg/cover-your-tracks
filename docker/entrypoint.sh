#!/bin/sh

if [ ! -e "/tmp/secret_key" ]; then
  head -c 26 /dev/urandom > /tmp/secret_key
fi

if [ ! -e "/tmp/keyfile" ]; then
  head -c 16 /dev/urandom > /tmp/keyfile
fi

SECRET_KEY=$(cat /tmp/secret_key)
export SECRET_KEY

export KEYFILE=/tmp/keyfile

export DB_HOST=$DB_PORT_3306_TCP_ADDR
export DB_PORT=$DB_PORT_3306_TCP_PORT
export DB_USERNAME=$DB_ENV_MYSQL_USER
export DB_PASSWORD=$DB_ENV_MYSQL_PASSWORD
export DB_DATABASE=$DB_ENV_MYSQL_DATABASE

$@
