FROM python:3.11

MAINTAINER William Budington <bill@eff.org>

EXPOSE 5000

WORKDIR /opt

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
    python3.11-dev \
    cron && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/*
ADD docker/crontab /etc/crontab

RUN pip install pipenv
ADD Pipfile Pipfile.lock ./
RUN pipenv install

ADD config_example.py env_config.py db.py entropy_helper.py main.py gunicorn.conf util.py ./
ADD fingerprint ./fingerprint/
ADD tracking ./tracking/
ADD static ./static/ 
ADD templates ./templates/
ADD docker ./docker/

ENV PUBLIC True
ENTRYPOINT ["/opt/docker/entrypoint.sh"]
CMD ["pipenv", "run", "python", "main.py"]
