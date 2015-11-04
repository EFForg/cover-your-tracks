import MySQLdb

import config


class Db(object):

    def __init__(self):
        self.host = config.db_host
        self.username = config.db_username
        self.password = config.db_password
        self.database = config.db_database
        self.port = config.db_port

    def connect(self):
        self.cxn = MySQLdb.connect(
            host=self.host,
            user=self.username,
            passwd=self.password,
            db=self.database,
            port=self.port)

    def count_sightings(self, cookie, signature):
        c = self.cxn.cursor()
        c.execute("""SELECT COUNT(cookie_id) FROM cookies
            WHERE cookie_id=%s AND signature=%s""", (cookie, signature))
        return c.fetchone()[0]

