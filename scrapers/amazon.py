from bs4 import BeautifulSoup
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from multiprocessing import Pool
import time

def amazon(prod):
    prod.replace(" ","+")
    chrome_options = Options()
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(f'https://www.amazon.in/s?k={prod}')
    html_content = driver.page_source
    amazon_results = BeautifulSoup(html_content, 'html5lib').find_all('div', class_='s-main-slot s-result-list s-search-results sg-row')[0].find_all('div')
    data_list = []
    for element in amazon_results:
        if element.has_attr('data-asin'):
            image = element.find_all('span')
            price = element.find_all('span', class_='a-price')
            name = element.find_all('span', class_="a-size-medium a-color-base a-text-normal")
            url = element.find_all("a", class_="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal")
            if image and name and price:
                image = image[0].find('img')['src'] if image else None
                price_text = price[0].find('span', class_='a-offscreen').text if price else None
                name_text = name[0].text if name else None
                url= url[0]["href"]
                if("https" not in url): url="https://amazon.in"+url
                data_list.append({'Image': image, 'Product': name_text, 'Price': price_text,"Url": url})
    if data_list:
        return json.dumps(data_list[:min(5,len(data_list))],indent=2)
    else: 
        return ""
    
def getAccountReviews(url):
    chrome_options = Options()
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://www.amazon.in/Kreo-Anti-ghosting-Tenkeyless-Mechanical-Detachable/dp/B0C851T6PC/ref=sr_1_1_sspa?crid=ZEZWWAV9086E&keywords=kreo%2Bkeyboard&qid=1707936455&sprefix=kreo%2Bkeyboar%2Caps%2C204&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1")
    # driver.get(url)
    time.sleep(5)
    html_content = driver.page_source
    amazon_results = BeautifulSoup(html_content, 'html5lib').find_all('div', class_='your-content-tab-container')[0].find_all('div', class_='your-content-card-wrapper  your-content-card-desktop')
    print(amazon_results)
    for result in amazon_results:
        print(result.find('span', class_='your-content-card-with-background').text)

# getAccountReviews("https://www.amazon.in/gp/profile/amzn1.account.AHSESHGFL2RCGJYQNMMQX4XX6BCA/")