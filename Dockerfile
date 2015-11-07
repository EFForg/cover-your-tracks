FROM python:2.7

MAINTAINER William Budington <bill@eff.org>

EXPOSE 5000

WORKDIR /opt
ADD requirements.txt ./
RUN pip install -r requirements.txt

ADD config_example.py env_config.py db.py entropy_helper.py fingerprint_agent.py fingerprint_helper.py fingerprint_recorder.py main.py tracking_helper.py tracking_recorder.py util.py ./
ADD static ./static/ 
ADD templates ./templates/
ADD docker ./docker/

ENV PUBLIC True
ENTRYPOINT ["/opt/docker/entrypoint.sh"]
CMD ["python", "main.py"]
