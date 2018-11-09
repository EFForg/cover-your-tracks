import hashlib

import MySQLdb

import env_config as config


class Db(object):

    @staticmethod
    def epoch_prefix(epoched):
        if epoched:
            return 'epoch_'
        return ''

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
            port=self.port,
            charset='utf8')

    def count_sightings(self, cookie, signature):
        c = self.cxn.cursor()
        c.execute("""SELECT COUNT(cookie_id) FROM cookies
            WHERE cookie_id=%s AND signature=%s""", (str(cookie), signature))
        return c.fetchone()[0]

    def record_sighting(self, cookie, signature, ip, google_style_ip):
        c = self.cxn.cursor()
        c.execute("""INSERT INTO cookies SET
            cookie_id=%s,
            signature=%s,
            ip=UNHEX(%s),
            ip34=UNHEX(%s)""", (
            str(cookie),
            signature,
            ip,
            google_style_ip
        )
        )
        self.cxn.commit()

    def record_fingerprint(self, whorls):
        c = self.cxn.cursor()
        exec_str = "INSERT INTO fingerprint SET "
        exec_str += ", ".join(map(lambda x: x + "=%s", whorls.keys()))
        exec_str += " ON DUPLICATE KEY UPDATE count=count + 1"
        c.execute(exec_str, tuple(whorls.values()))
        c.execute(
            "INSERT INTO fingerprint_times SET fingerprint_id=%s", (c.lastrowid,))
        self.cxn.commit()

    def update_totals(self, whorls):
        c = self.cxn.cursor()
        update_str = """INSERT INTO totals SET
            total=1, epoch_total=1, variable=%s, value=%s
            ON DUPLICATE KEY UPDATE total=total+1, epoch_total=epoch_total+1"""
        c.execute(update_str, ('count', ''))
        for i in whorls:
            c.execute(update_str, (i, whorls[i]))
        self.cxn.commit()

    def get_whorl_value_count(self, variable, value, epoched):
        c = self.cxn.cursor()
        c.execute(
            "SELECT " + self.epoch_prefix(epoched) + "total FROM totals WHERE variable=%s AND value=%s", (variable, value))
        return c.fetchone()[0]

    def get_total_count(self, epoched):
        c = self.cxn.cursor()
        c.execute("SELECT " + self.epoch_prefix(epoched) +
                  "total FROM totals WHERE variable='count'")
        return c.fetchone()[0]

    def get_signature_matches_count(self, signature, epoched):
        c = self.cxn.cursor()
        c.execute(
            "SELECT " + self.epoch_prefix(epoched) + "total FROM totals WHERE variable='signature' AND value=%s", (signature, ))
        return c.fetchone()[0]

    def record_tracking_results(
            self,
            cookie,
            ip,
            google_style_ip,
            ad_result,
            tracker_result,
            dnt_result,
            known_blockers):
        c = self.cxn.cursor()
        c.execute("""INSERT INTO `tracking_test` SET
            `cookie_id`=%s,
            `ip`=UNHEX(%s),
            `ip34`=UNHEX(%s),
            `block_tracking_ads`=%s,
            `block_invisible_trackers`=%s,
            `dnt`=%s,
            `canvas_fingerprinting`=NULL,
            `known_blockers`=%s""", (
            str(cookie),
            ip,
            google_style_ip,
            ad_result,
            tracker_result,
            dnt_result,
            known_blockers
        )
        )
        self.cxn.commit()

    def get_epoch_beginning(self):
        c = self.cxn.cursor()
        c.execute("""SELECT value
            FROM totals
            WHERE variable='epoch_beginning'""")
        res = c.fetchone()
        if res == None:
            return None
        else:
            return res[0]

    def _epoch_total_helper(self, c, columns_to_update, columns_to_md5, operation):
        if(operation != '+' and operation != '-'):
            return

        row = c.fetchone()
        while row != None:
            fingerprint_id = row[0]
            count = row[1]
            fingerprint_c = self.cxn.cursor()
            fingerprint_c.execute(
                "SELECT " + ", ".join(columns_to_update) +
                " FROM fingerprint WHERE id=%s", (fingerprint_id, ))
            fingerprint_row = fingerprint_c.fetchone()
            if fingerprint_row != None:
                i = 0
                totals_c = self.cxn.cursor()
                for variable in columns_to_update:
                    if variable in columns_to_md5:
                        if isinstance(fingerprint_row[i], unicode):
                            value = hashlib.md5(fingerprint_row[i].encode('utf-8')).hexdigest()
                        else:
                            value = hashlib.md5(fingerprint_row[i]).hexdigest()
                    else:
                        value = fingerprint_row[i]
                    i += 1
                    totals_c.execute(
                        """UPDATE totals SET epoch_total=epoch_total""" + operation + """%s
                        WHERE variable=%s AND value=%s""", (count, variable, value))
                totals_c.execute(
                    """UPDATE totals SET epoch_total=epoch_total""" + operation + """%s
                    WHERE variable='count'""", (count,))
            row = c.fetchone()

    def epoch_update_totals(self, old_epoch_beginning, new_epoch_beginning, columns_to_update, columns_to_md5):
        c = self.cxn.cursor()
        if old_epoch_beginning == None:
            c.execute(
                "INSERT INTO totals SET value=%s, variable='epoch_beginning'",
                (new_epoch_beginning, ))
        else:
            c.execute("""SELECT fingerprint_id, count(id)
                      FROM fingerprint_times
                      WHERE timestamp BETWEEN %s AND %s GROUP BY fingerprint_id""",
                      (old_epoch_beginning, new_epoch_beginning))
            self._epoch_total_helper(c, columns_to_update, columns_to_md5, '-')
            c.execute(
                """UPDATE totals SET value=%s
                WHERE variable='epoch_beginning'""", (new_epoch_beginning, ))
        self.cxn.commit()

    def epoch_calculate_totals(self, old_epoch_beginning, new_epoch_beginning, columns_to_update, columns_to_md5):
        c = self.cxn.cursor()

        if old_epoch_beginning == None:
            c.execute(
                "INSERT INTO totals SET value=%s, variable='epoch_beginning'",
                (new_epoch_beginning, ))
        else:
            c.execute(
                """UPDATE totals SET value=%s
                WHERE variable='epoch_beginning'""", (new_epoch_beginning, ))

        c.execute("UPDATE totals SET epoch_total=0 WHERE 1")
        c.execute("""SELECT fingerprint_id, count(id)
                  FROM fingerprint_times
                  WHERE timestamp > %s GROUP BY fingerprint_id""",
                  (new_epoch_beginning, ))
        self._epoch_total_helper(c, columns_to_update, columns_to_md5, '+')
        self.cxn.commit()
