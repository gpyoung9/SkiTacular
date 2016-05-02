__author__ = 'bchen11'
import json
import urllib2
import requests
import random

for i in range(100):
    data = json.load(urllib2.urlopen('https://skimap.org/SkiAreas/view/'+ str(i+1) +'.json'))
    if 'name' in data and 'regions' in data and 'official_website' in data:
        r = requests.post("http://localhost:4000/api/resorts", headers={'Content-type':'application/x-www-form-urlencoded'}, data={'name': data['name'], 'Location': data['regions'][0]['name'], 'Price': random.randint(50, 500), 'Distance': random.randint(50, 600),'Latitude': data['latitude'],'Longitude': data['longitude'], 'URL': data['official_website']})
        print(r.status_code, r.reason, r.content)
