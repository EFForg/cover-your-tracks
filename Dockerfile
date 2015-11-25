FROM python:2.7

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
CMD ["python", "main.py"]
