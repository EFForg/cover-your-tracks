# Panopticlick

How Unique - and Trackable - Is Your Browsesr?

## Installation

The easiest way to set up an instance of Panopticlick is with `docker` and `docker-compose`, but it can be installed on a host machine if desired.

### Partial Installation on Host

You may need to install `libmysqlclient-dev` and `python-dev` for Debian-based systems.

    pip install -r requirements.txt
    cp config_example.py config.py

Then modify the relevant variables in config.py

Now, you can run

    python main.py

### Full Docker Installation

Change each of the secrets in `docker/secrets/` to a random value.

Then, from the git root, run

    docker-compose up

## Deploying

uWSGI has exposed port 80 for all virtualhosts, so any edge-node load balancer should be able to point directly to the hosts port 80.

## License

This project is licensed under the Affero General Public License, version 3.  See the LICENSE file for details.

## Credits

This is a rewrite of the original Panopticlick codebase, developed by Peter Eckersley at the Electronic Frontier Foundation.  Currently maintained by William Budington.
