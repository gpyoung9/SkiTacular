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

working_web="http://www.onthesnow.com/united-states/skireport.html"
prefix="http://www.onthesnow.com"

directory="usa_scraped_data"

def getWebsiteOneData():
	data_og=[]
	page = urlopen(working_web).read()
	soup = BeautifulSoup(page)
	soup.prettify()
	#print(soup)
	#http://stackoverflow.com/questions/9253684/selecting-specific-tr-tags-with-beautifulsoup
	rows=soup.findAll('tr', {'class': 'rowB'})
	for r in rows:
		tag_a = r.find('a')   
		data_og.append([tag_a.text, tag_a['href']])
	
	#print(data_og)
	mountain_dict={}
	print("scraping: ", str(len(data_og)), " mountains")
	for x in data_og:
		#we are now opening a specifc mountains detail page
		###scrape resort name
		
		init_detail_url=prefix+x[1]
		proper_prefix_index=init_detail_url.rindex('/')+1

		#scrape resort description
		#print(init_detail_url)
		browser_6 = RoboBrowser(history=True)
		browser_6.open(init_detail_url)
		r_d = browser_6.select('.resort_description')
		soup_7 = BeautifulSoup(str(r_d))
		p_s= soup_7.findAll('p')
		description=""
		for p in p_s:
			description+=p.getText()+"\n"
		


		snow_report_url=init_detail_url[:proper_prefix_index]+"skireport.html"
		browser_2 = RoboBrowser(history=True)
		browser_2.open(snow_report_url)

		#print(init_detail_url)
		mountain_name=x[0]

		print(mountain_name)
		#print(init_detail_url)

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
		lift_url=init_detail_url[:proper_prefix_index]+"lift-tickets.html"
		#print(lift_url)
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
		#print(data)
		weekday_prices=data[1][1:-1]
		weekend_prices=data[2][1:]
		#print(weekday_prices)
		#print(weekend_prices)


		###scrape trail map picture:
		image_url=init_detail_url[:proper_prefix_index]+"trailmap.html"
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
		driving_url=init_detail_url[:proper_prefix_index]+"driving-directions.html"
		#print(driving_url)
		browser_3 = RoboBrowser(history=True)
		browser_3.open(driving_url)
		direction_text=browser_3.select('.directions')
		soup_4 = BeautifulSoup(str(direction_text))
		destination_text = soup_4.find("input", {"id": "end"})
		destination_text = destination_text['value']
		

		#soup_3 = BeautifulSoup(str(mountain_name))
		#mountain_name=soup_3.find('span').getText()
		#print(mountain_name)

		#trail info scraper 
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
				#print(runs_open)
				#exit()
			except:
				print("no trail number info")
				total_num=-1
		except:
			print("no trail info")
			num_open=-1

		if mountain_name not in mountain_dict:
			#send %instead of open and total
			percent_trails_open=float(num_open)/float(total_num)
			mountain_dict[mountain_name]={'resort_description':description, 'percent_trails_open':percent_trails_open, 'resort_website': website_of_resort_link, 'resort_location':destination_text, 'weekday_prices': weekday_prices, 'weekend_prices': weekend_prices, 'trail_map_url': img_src}
		
	print(len(mountain_dict))
	return mountain_dict

def write_data_to_file(dictionary):
	systemDate = datetime.date.today()
	systemDate = systemDate.strftime("%Y%m%d")

	if not os.path.exists(directory):
		os.makedirs(directory)	
	filename=directory+"/"+systemDate+".json"	

	#http://stackoverflow.com/questions/7100125/storing-python-dictionaries
	with open(filename, 'w') as fp:
		json.dump(dictionary, fp)
		print("success write")



if __name__ == '__main__':
	#for testing only
	scraped_data=getWebsiteOneData()
	write_data_to_file(scraped_data)
			
