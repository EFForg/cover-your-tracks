# Panopticlick

How Unique - and Trackable - Is Your Browsesr?

## Installation

The easiest way to set up an instance of Panopticlick is with `docker`, but it can be installed on a host machine if desired.

### Partial Installation on Host

You may need to install `libmysqlclient-dev` and `python-dev` for Debian-based systems.

    pip install -r requirements.txt
    cp config_example.py config.py

Then modify the relevant variables in config.py

Now, you can run

    python main.py

### Full Docker Installation

First, build the image

    docker build -t panopticlick .

To generate self-signed certificates for the Panopticlick hosts, cd into `examples/nginx` and run 

    ./generate_self_signed_certs.sh

Then, from the git root, run

    docker run -d --name panopticlick-db \
      -e MYSQL_ROOT_PASSWORD=changeme \
      -e MYSQL_USER=panopticlick \
      -e MYSQL_PASSWORD=changeme \
      -e MYSQL_DATABASE=panopticlick \
      -v $(pwd)/examples/sql:/docker-entrypoint-initdb.d \
      mysql --default-authentication-plugin=mysql_native_password
    docker run -d --name panopticlick-app \
      --link panopticlick-db:db \
      panopticlick
    docker run -d --name panopticlick-nginx \
      --link panopticlick-app:app \
      -v $(pwd)/examples/nginx/extra:/etc/nginx/extra \
      -v $(pwd)/examples/nginx/conf.d:/etc/nginx/conf.d \
      -p 443:443 \
      nginx

## Viewing Locally

Unless you've changed the server names specified in `config.py`, you'll have to add the following line to your `/etc/hosts` file:

    127.0.0.1 panopticlick.eff.org trackersimulator.org firstpartysimulator.org firstpartysimulator.net eviltracker.net do-not-tracker.org

If you generated the certs yourself, in Firefox you'll have to go into private browsing mode to see the "I Understand the Risks" dialogue.  You may also have to manually go to each of the above domains and go through the certificate exception process for each one in order for the application to be fully functional. Or with chrome, you can start chrome with the `--ignore-certificate-errors` flag, but beware this will ignore *all* certificate errors.

## License

This project is licensed under the Affero General Public License, version 3.  See the LICENSE file for details.

## Credits

This is a rewrite of the original Panopticlick codebase, developed by Peter Eckersley at the Electronic Frontier Foundation.  Currently maintained by William Budington.
