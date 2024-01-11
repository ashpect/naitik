
import csv
import selenium.webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import sys
origin = input("Give IATA code for origin city")				
destin = input("Give IATA code for destination city")				 				
trDate = input("give date in the form of DD/MM/YYYY")			


baseDataUrl = "https://www.makemytrip.com/flight/search?itinerary="+ origin +"-"+ destin +"-"+ trDate +"&tripType=O&paxType=A-1_C-0_I-0&intl=false&=&cabinClass=E"

driver = selenium.webdriver.Chrome() 
print ("Requesting URL: " + baseDataUrl)
driver.get(baseDataUrl)  			 
print ("Webpage found ...")
element_xpath = '//*[@id="left-side--wrapper"]/div[2]' 
element = WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.XPATH, element_xpath)))
print ("Scrolling document upto bottom ...")
for j in range(1, 100):
    try:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    except:
        print(j)	
body = driver.find_element(By.TAG_NAME,"body").get_attribute("innerHTML")
print("Closing Chrome ...") 
driver.quit() 				
soup = BeautifulSoup(body, 'html.parser')
flight_entries = soup.find_all('div', class_='makeFlex spaceBetween')
with open("MMT.csv", 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['Airline Name', 'Flight Code', 'Departure Time', 'Departure Location', 'Stop Time', 'Stop Status', 'Price'])
    for entry in flight_entries:
        airline_name = entry.find('p', class_='airlineName').text.strip()
        flight_code = entry.find('p', class_='fliCode').text.strip()
        time_info_left = entry.find('div', class_='timeInfoLeft')
        departure_time = time_info_left.find('span').text.strip()
        departure_location = time_info_left.find('font', color="#000000").text.strip()
        stop_info = entry.find('div', class_='stop-info')
        stop_time = stop_info.find('p').text.strip()
        stop_status = stop_info.find('p', class_='flightsLayoverInfo').text.strip()
        price = entry.find('div', class_='clusterViewPrice').text.strip()
        csv_writer.writerow([airline_name, flight_code, departure_time, departure_location, stop_time, stop_status, price])
print("all done")