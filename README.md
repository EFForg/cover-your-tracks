# Panopticlick

How Unique - and Trackable - Is Your Browsesr?

## Installation

You may need to install `libmysqlclient-dev` and `python-dev` for Debian-based systems.

    pip install -r requirements.txt
    cp config_example.py config.py

Then modify the relevant variables in config.py

## Running

    python main.py

## Docker

First, build the image

    docker build -t panopticlick .

Then,

    docker run -d --name panopticlick-db \
      -e MYSQL_ROOT_PASSWORD=changeme \
      -e MYSQL_USER=panopticlick \
      -e MYSQL_PASSWORD=changeme \
      -e MYSQL_DATABASE=panopticlick \
      -v $(pwd)/examples/sql:/docker-entrypoint-initdb.d \
      mysql
    docker run -d --name panopticlick-app \
      --link panopticlick-db:db \
      panopticlick
    docker run -d --name panopticlick-nginx \
      --link panopticlick-app:app \
      -v $(pwd)/examples/nginx/extra:/etc/nginx/extra \
      -v $(pwd)/examples/nginx/conf.d:/etc/nginx/conf.d \
      -p 443:443 \
      nginx

## License

This project is licensed under the Affero General Public License, version 3.  See the LICENSE file for details.

## Credits

This is a rewrite of the original Panopticlick codebase, developed by Peter Eckersley at the Electronic Frontier Foundation.  Currently maintained by William Budington.
