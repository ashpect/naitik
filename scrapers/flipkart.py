from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import json
def flip(prod):
    prod=prod.replace(" ","%20")
    chrome_options = Options()
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(f'https://www.flipkart.com/search?q={prod}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off')
    html_content = driver.page_source
    soup = BeautifulSoup(html_content, 'html5lib')
    divs_with_class = soup.find_all('div', class_='_1YokD2 _3Mn1Gg')
    products_data = []
    for div in divs_with_class:
        inner_divs = div.find_all('div', class_='_4ddWXP')
        for element in inner_divs:
            product_name = element.find('a', class_='s1Q9rs')['title']
            product_price = element.select_one('a._8VNy32 ._30jeq3').text
            product_picture_url = element.select_one('div._4ddWXP img._396cs4')['src']+" "
            product_url = element.find('a', class_='s1Q9rs')['href']
            if("https" not in product_url): product_url="https://www.flipkart.com"+product_url
            product_data = {
                'Product Name': product_name,
                'Product Price': product_price,
                'Product Picture URL': product_picture_url,
                "Flipkart URL": product_url
            }
            products_data.append(product_data)
    driver.quit()
    print(product_data)
    if products_data:
        return json.dumps(products_data[:10],indent=2)
    else: 
        return ""