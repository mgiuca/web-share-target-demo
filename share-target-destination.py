#!/usr/bin/env python

from jinja2 import Environment, FileSystemLoader
from os import path
from webapp2 import RequestHandler, WSGIApplication


JINJA_ENVIRONMENT = Environment(
    loader=FileSystemLoader(path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


def escape(text):
  return text.replace('\\', '\\\\').replace('\'', '\\\'')


class MainPage(RequestHandler):
    def post(self):
        main_template = JINJA_ENVIRONMENT.get_template('share-target-destination.template.html')

        main_template_values = {
          'generation_location': 'server-side',
          'received_title': escape(self.request.get('received_title', '')),
          'received_text': escape(self.request.get('received_text', '')),
          'received_url': escape(self.request.get('received_url', ''))
        }
        self.response.write(main_template.render(main_template_values))


app = WSGIApplication([
    ('/share-target-destination.html', MainPage),
])
