from bs4 import BeautifulSoup
from time import sleep
from urllib.request import urlopen
import csv

url = "http://www.pseb.ac.in/en/e-books/190"

data = []

def scrape(url , data, add = ""):
    newURL = url+add
    PAGE = urlopen(newURL)
    soup = BeautifulSoup(PAGE, "html.parser")
    table = soup.find("table")

    for link in table.find_all('a'):
        bookURL = "www.pseb.ac.in" + link.get('href').strip()
        data.append([link.getText() , bookURL])

scrape(url , data)

add = "?page="
for page in range(1 , 7):
    scrape(url , data , add+str(page))

# File writing
f = open('1.csv', 'w')
writer = csv.writer(f)
for i in data:
    writer.writerow(i)
f.close()