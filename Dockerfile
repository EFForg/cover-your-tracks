FROM python:3.6

MAINTAINER William Budington <bill@eff.org>

EXPOSE 5000

WORKDIR /opt
ADD requirements.txt ./
RUN pip install -r requirements.txt

ADD config_example.py env_config.py db.py entropy_helper.py main.py util.py ./
ADD bower_components ./bower_components/
ADD fingerprint ./fingerprint/
ADD tracking ./tracking/
ADD static ./static/ 
ADD templates ./templates/
ADD docker ./docker/

ENV PUBLIC True
ENTRYPOINT ["/opt/docker/entrypoint.sh"]
CMD ["uwsgi", "-s", "0.0.0.0:5000", "-w", "main:app", "--static-map", "/static=/opt/static", "-m", "--stats", "127.0.0.1:1717", "--cheaper", "2", "--workers", "16", "--cheaper-step", "1"]
