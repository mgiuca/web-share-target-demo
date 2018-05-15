#!/usr/bin/env python

from cgi import FieldStorage
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

        form = FieldStorage()
        print("Looking up")
        fileitem = form["received_files"]
        print("Looked up")

        if fileitem.file:
          print("File received")
          # It's an uploaded file; count lines
          linecount = 0
          while 1:
              line = fileitem.file.readline()
              if not line: break
              linecount = linecount + 1
          print(linecount)
        else:
          print("No file received")

        self.response.write(main_template.render(main_template_values))


app = WSGIApplication([
    ('/share-target-destination.html', MainPage),
])
