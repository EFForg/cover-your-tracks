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
      -v $(pwd)/examples/sql:/docker-entrypoint-initdb.d mysql
    docker run -d --name panopticlick-app \
      --link panopticlick-db:db \
      -p 5000:5000 \
      panopticlick

## License

This project is licensed under the Affero General Public License, version 3.  See the LICENSE file for details.

## Credits

This is a rewrite of the original Panopticlick codebase, developed by Peter Eckersley at the Electronic Frontier Foundation.  Currently maintained by William Budington.
