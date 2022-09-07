class FingerprintAgent(object):

    def __init__(self, request):
        self.request = request

    def detect_server_whorls(self):
        vars_v2 = {}
        # get cookie enabled
        if self.request.cookies:
            vars_v2['cookie_enabled'] = 'Yes'
        else:
            vars_v2['cookie_enabled'] = 'No'

        # get user_agent
        vars_v2['user_agent'] = self._get_header('User-Agent')
        # get http_accept
        vars_v2['http_accept'] = " ".join([
            self._get_header('Accept'),
            self._get_header('Accept-Charset'),
            self._get_header('Accept-Encoding'),
            self._get_header('Accept-Language')
        ])

        vars_v2['dnt_enabled'] = (self._get_header('DNT') != "")

        # these are dummies:
        vars_v2['plugins'] = u"no javascript"
        vars_v2['video'] = u"no javascript"
        vars_v2['timezone'] = u"no javascript"
        vars_v2['language'] = u"no javascript"
        vars_v2['platform'] = u"no javascript"
        vars_v2['touch_support'] = u"no javascript"
        vars_v2['fonts_v2'] = u"no javascript"
        vars_v2['supercookies_v2'] = u"no javascript"
        vars_v2['canvas_hash_v2'] = u"no javascript"
        vars_v2['webgl_hash_v2'] = u"no javascript"
        vars_v2['timezone_string'] = u"no javascript"
        vars_v2['webgl_vendor_renderer'] = u"no javascript"
        vars_v2['ad_block'] = u"no javascript"
        vars_v2['audio'] = u"no javascript"
        vars_v2['cpu_class'] = u"no javascript"
        vars_v2['hardware_concurrency'] = u"no javascript"
        vars_v2['device_memory'] = u"no javascript"

        vars_v3 = vars_v2.copy()
        vars_v3['loads_remote_fonts'] = u"no js"

        return (vars_v2, vars_v3)

    def _get_header(self, header):
        return self.request.headers.get(header) or ""
