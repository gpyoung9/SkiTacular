import numpy as np
from urllib.request import urlopen
try:
	from bs4 import BeautifulSoup 
except ImportError:
	from BeautifulSoup import BeautifulSoup
import re
from robobrowser import RoboBrowser
import csv
import datetime
import json
import os



website="http://www.onthesnow.com/colorado/loveland/skireport.html"

working_web="http://www.onthesnow.com/skireport.html"
prefix="http://www.onthesnow.com"

directory="scraped_data"

def getWebsiteOneData():
	browser = RoboBrowser(history=True)
	browser.open(working_web)
	mountain_list=browser.select('.a')

	mountain_dict={}
	#print(mountain_list)
	for x in mountain_list:
		html = str(x)
		#print(type(x))
		soup = BeautifulSoup(html)
		for a in soup.find_all('a', href=True):
			the_href=a['href']
			#print(prefix+the_href)
			#details = browser.follow_link(prefix+the_href)
			#we are now opening a specifc mountains detail page


			###scrape resort name
			browser_2 = RoboBrowser(history=True)
			init_detail_url=prefix+the_href
			browser_2.open(init_detail_url)
			mountain_name=browser_2.select('.resort_name')


			###scrape resort url
			website_of_resort=browser_2.select('.contact_wrap')
			soup_4 = BeautifulSoup(str(website_of_resort))
			try:
				website_of_resort_link=soup_4.find('a').getText()
			except:
				print("no webpage")
				website_of_resort_link="sorry, no link found, try google search"
			#print(website_of_resort_link)


			###scrape lift tickets:
			lift_url=init_detail_url[:-14]+"lift-tickets.html"
			browser_4 = RoboBrowser(history=True)
			browser_4.open(lift_url)
			ticket_box=browser_4.select('.resort_ticket_price')
			soup_5 = BeautifulSoup(str(ticket_box))
			data=[]
			#source: http://stackoverflow.com/questions/23377533/python-beautifulsoup-parsing-table
			for tr in soup_5.find_all('tr'):
				cols = tr.find_all('td')
				cols = [ele.text.strip() for ele in cols]
				data.append([ele for ele in cols if ele])
			#child, junior, adult, senior
			weekday_prices=data[1][1:-1]
			weekend_prices=data[2][1:]
			#print(weekday_prices)
			#print(weekend_prices)


			###scrape trail map picture:
			image_url=init_detail_url[:-14]+"trailmap.html"
			browser_5 = RoboBrowser(history=True)
			browser_5.open(image_url)
			map_html=browser_5.select('.trailMap')
			soup_6=BeautifulSoup(str(map_html))
			try:
				img_tag=soup_6.find("img")
			except:
				print("image not found")
				img_rc="NULL"
			try:
				img_src=img_tag['src']
			except:
				img_src="NULL"



			###scrape address:
			driving_url=init_detail_url[:-14]+"driving-directions.html"
			#print(driving_url)
			browser_3 = RoboBrowser(history=True)
			browser_3.open(driving_url)
			direction_text=browser_3.select('.directions')
			soup_4 = BeautifulSoup(str(direction_text))
			destination_text = soup_4.find("input", {"id": "end"})
			destination_text = destination_text['value']
			

			soup_3 = BeautifulSoup(str(mountain_name))
			mountain_name=soup_3.find('span').getText()
			print(mountain_name)
			runs_open=browser_2.select('.pie_chart_item')
			try:
				run_info=str(runs_open[0])
				soup_2 = BeautifulSoup(run_info)
				numbers=soup_2.find('p').getText()
				of_index=numbers.index('of')
				num_open=int(numbers[0:of_index])
				try:
					total_num=int(numbers[of_index+2:])
					#print(num_open)
					#print(total_num)
					if mountain_name not in mountain_dict:
						#send %instead of open and total
						mountain_dict[mountain_name]={'resort_open_trails':num_open, 'resort_total_trails':total_num, 'resort_website': website_of_resort_link, 'resort_location':destination_text, 'weekday_prices': weekday_prices, 'weekend_prices': weekend_prices, 'trail_map_url': img_src}
					#print(runs_open)
					#exit()
				except:
					print("no trail number info")
			except:
				print("no trail info")
		continue

	return mountain_dict

def write_data_to_file(dictionary):
	systemDate = datetime.date.today()
	systemDate = systemDate.strftime("%Y%m%d")

	if not os.path.exists(directory):
		os.makedirs(directory)	
	filename=directory+"/"+systemDate+".json"	

	with open(filename, 'w') as fp:
		json.dump(dictionary, fp)
		print("success write")



if __name__ == '__main__':
	#for testing only
	scraped_data=getWebsiteOneData()
	write_data_to_file(scraped_data)
			
