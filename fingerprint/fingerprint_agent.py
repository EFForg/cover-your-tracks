class FingerprintAgent(object):

    def __init__(self, request):
        self.request = request

    def detect_server_whorls(self):
        vars = {}
        # get cookie enabled
        if self.request.cookies:
            vars['cookie_enabled'] = 'Yes'
        else:
            vars['cookie_enabled'] = 'No'

        # get user_agent
        vars['user_agent'] = self._get_header('User-Agent')
        # get http_accept
        vars['http_accept'] = " ".join([
            self._get_header('Accept'),
            self._get_header('Accept-Charset'),
            self._get_header('Accept-Encoding'),
            self._get_header('Accept-Language')
        ])
        vars['legacy_http_accept'] = " ".join([
            self._get_header('Accept').split(";")[0],
            self._get_header('Accept-Charset'),
            self._get_header('Accept-Encoding'),
            self._get_header('Accept-Language')
        ])

        vars['dnt_enabled'] = (self._get_header('DNT') != "")

        # these are dummies:
        vars['plugins'] = u"no javascript"
        vars['video'] = u"no javascript"
        vars['timezone'] = u"no javascript"
        vars['fonts'] = u"no javascript"
        vars['legacy_fonts'] = u"no javascript"
        vars['supercookies'] = u"no javascript"
        vars['canvas_hash'] = u"no javascript"
        vars['webgl_hash'] = u"no javascript"
        vars['language'] = u"no javascript"
        vars['platform'] = u"no javascript"
        vars['touch_support'] = u"no javascript"

        return vars

    def _get_header(self, header):
        return self.request.headers.get(header) or ""
