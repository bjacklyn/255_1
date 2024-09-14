import unittest
import json
import pandas as pd
from io import StringIO, BytesIO
from flask import Flask, request
from project import app, clean_data

class CleanDataTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_valid_csv(self):
        data = {
            'file': (BytesIO(b"A,B,C\n1,2,3\n4,5,6\n7,8,9"), 'test.csv')
        }
        response = self.app.post('/clean', content_type='multipart/form-data', data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/json')
        cleaned_data = json.loads(response.data)
        self.assertEqual(len(cleaned_data), 3)

    def test_csv_with_missing_values(self):
        data = {
            'file': (BytesIO(b"A,B,C\n1,,3\n4,5,\n7,8,9"), 'test.csv')
        }
        response = self.app.post('/clean', content_type='multipart/form-data', data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/json')
        cleaned_data = json.loads(response.data)
        self.assertNotIn('B', cleaned_data[0])

    def test_csv_no_numerical_columns(self):
        data = {
            'file': (BytesIO(b"A,B,C\nx,y,z\na,b,c\nm,n,o"), "test.csv")
        }
        response = self.app.post('/clean', content_type='multipart/form-data', data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/json')
        cleaned_data = json.loads(response.data)
        self.assertEqual(len(cleaned_data), 3)

    def test_csv_no_string_columns(self):
        data = {
            'file': (BytesIO(b"A,B,C\n1,2,3\n4,5,6\n7,8,9"), 'test.csv')
        }
        response = self.app.post('/clean', content_type='multipart/form-data', data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/json')
        cleaned_data = json.loads(response.data)
        self.assertEqual(len(cleaned_data), 3)

    def test_csv_no_string_columns2(self):
        data = {
            'file': (BytesIO(b"A,B,C\n1,2,3\n4,5,6\n7,8,9"), 'test.csv')
        }
        response = self.app.post('/clean', content_type='multipart/form-data', data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/json')
        cleaned_data = json.loads(response.data)
        self.assertEqual(len(cleaned_data), 3)
        self.assertIn('A', cleaned_data[0])
        self.assertIn('B', cleaned_data[0])
        self.assertIn('C', cleaned_data[0])

    def test_invalid_file_format(self):
        data = {
            'file': (BytesIO(b"Not a CSV content"), 'test.txt')
        }
        response = self.app.post('/clean', content_type='multipart/form-data', data=data)
        self.assertEqual(response.status_code, 500)

    def test_empty_file(self):
        data = {
            'file': (BytesIO(b""), 'test.csv')
        }
        response = self.app.post('/clean', content_type='multipart/form-data', data=data)
        self.assertEqual(response.status_code, 500)

if __name__ == '__main__':
    unittest.main()