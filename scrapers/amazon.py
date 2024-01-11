from bs4 import BeautifulSoup
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from multiprocessing import Pool
import os

# Set up Chrome options
chrome_options = Options()
driver = webdriver.Chrome(options=chrome_options)
driver.get("https://www.amazon.in/s?k=kreo+keyboard")
html_content = driver.page_source
amazon_results = BeautifulSoup(html_content, 'html5lib').find_all('div', class_='s-main-slot s-result-list s-search-results sg-row')[0].find_all('div')
for element in amazon_results:
    if element.has_attr('data-asin'):
        image = element.find_all('span')
        price = element.find_all('span', class_='a-price')
        if price:
            image = image[0].find('img')
            if image:
                print("Image URL: ", image['src'])
            print(price[0].find('span', class_='a-offscreen').text)
        # print(element.attrs)