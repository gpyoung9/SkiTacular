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
			browser_2 = RoboBrowser(history=True)
			browser_2.open(prefix+the_href)
			mountain_name=browser_2.select('.resort_name')

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
						mountain_dict[mountain_name]={'open':num_open, 'total':total_num}
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
			
