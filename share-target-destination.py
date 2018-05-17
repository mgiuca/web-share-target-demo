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

        main_template_values = {
          'generation_location': 'server-side',
          'received_title': escape(self.request.POST.get('received_title', '')),
          'received_text': escape(self.request.POST.get('received_text', '')),
          'received_url': escape(self.request.POST.get('received_url', ''))
        }
        print(self.request.headers)
        print(main_template_values)

        uploaded_file = self.request.POST.get('received_file')
        if uploaded_file:
          print('Name of file uploaded: ' + uploaded_file.filename)
          print('Type of file uploaded: ' + uploaded_file.type)
          file_contents = uploaded_file.file.read()
          main_template_values['received_file'] = file_contents
        else:
          print('No file uploaded')

        self.response.write(main_template.render(main_template_values))


app = WSGIApplication([
    ('/share-target-destination.html', MainPage),
])
