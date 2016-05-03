__author__ = 'bchen11'
import json
import urllib2
import requests
import random
num_zero = 0
zero_addresses=[3755,2877,82414,81227]

with open('20160503.json') as data_file:
    data = json.load(data_file)
    for sites in data:
        print sites
        # print data[sites]['weekday_prices']
        address = data[sites]['resort_location'].replace(",,", "+").replace(",", "+").replace(" ", "+")
        googleDist = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + "&key=AIzaSyDlPhwrvT97gH5WRVrjmiT1ZeItaE5AZt4");
        googleDist = googleDist.json()
        Latitude = 0
        Longtitude = 0
        if len(googleDist['results']) == 0:
            googleDist = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + str(zero_addresses[num_zero]) + "&key=AIzaSyDlPhwrvT97gH5WRVrjmiT1ZeItaE5AZt4");
            googleDist = googleDist.json()
            num_zero+=1
        # else:
        #     print googleDist['results'][0]['geometry']['location']['lat']

        Latitude = googleDist['results'][0]['geometry']['location']['lat']
        Longtitude = googleDist['results'][0]['geometry']['location']['lng']
        Price = 10000.0
        if len(data[sites]['weekday_prices'][2]) >= 3:
            Price = float(data[sites]['weekday_prices'][2][3:])

        Discount_price = 10000.0
        if len(data[sites]['weekday_prices'][0]) >= 3:
            Discount_price = float(data[sites]['weekday_prices'][0][3:])
        print data[sites]['trail_map_url']
        r = requests.post("http://localhost:4000/api/resorts",
                          headers={'Content-type':'application/x-www-form-urlencoded'},
                          data={'name': sites, 'Location':  data[sites]['resort_location'],
                                'Price': Price, 'Discount_price': Discount_price,
                                'URL': data[sites]['resort_website'], 'Img_URL' : data[sites]['trail_map_url'],
                                'Percent_trails_open' : data[sites]['percent_trails_open'], 'Description': data[sites]['resort_description'],
                                'Distance': random.randint(50, 600),
                                'Latitude': Latitude,'Longitude':Longtitude})
        print r.json()

    print "num of zeros " + str(num_zero)