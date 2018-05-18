#!/usr/bin/env python

from jinja2 import Environment, FileSystemLoader
from os import path
from webapp2 import RequestHandler, WSGIApplication

JINJA_ENVIRONMENT = Environment(
    loader=FileSystemLoader(path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


# How should we handle " in the text?
def escape(text):
  return text


class MainPage(RequestHandler):
    def post(self):
        main_template = JINJA_ENVIRONMENT.get_template('share-target-destination.template.html')

        attachments = self.request.POST.getall('received_file')
        print('attachments:' + str(attachments))
        # attachments:[u'']   when nothing is attached

        # [x for x in range(2, num) if is_prime(x)]

        attachments2 = [{'content': f.file.read(),
                         'filename': f.filename} for f in attachments if f != '']
        print('attachments2:' + str(attachments2))
        print(attachments2[0])
        print(attachments2[0]['filename'])
        print(attachments2[0]['content'])


        if True:
          main_template_values = {
            'generation_location': 'server-side',
            'received_title': escape(self.request.POST.get('received_title', '')),
            'received_text': escape(self.request.POST.get('received_text', '')),
            'received_url': escape(self.request.POST.get('received_url', ''))
          }
          print(self.request.headers)
          print(main_template_values)

          file_contents = attachments2[0]['content']
          main_template_values['received_file'] = file_contents

          self.response.write(main_template.render(main_template_values))


app = WSGIApplication([
    ('/share-target-destination.html', MainPage),
])
