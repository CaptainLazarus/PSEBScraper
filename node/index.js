const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const csv = require("csv");
const fastcsv = require("fast-csv");

async function scrape() {

    let URL = "http://www.pseb.ac.in/en/e-books/190";

    const browser = await puppeteer.launch();
    const page = await browser.newPage();    

    let SHEET = [];
    let query = "?page=";

    for(let i=0 ; i<7 ; i+=1){
        let temp = URL;
        if(i > 0){
            temp = URL+query+`${i}`;
            console.log(temp);
        }

        await page.goto(temp, {
            waitUntil: "domcontentloaded",
        });

        const html = await page.evaluate(() => {
            return {
                html: document.documentElement.innerHTML,
            };
        });

        const $ = cheerio.load(html.html);

        //Scraping has to change based on website.
        $("tbody > tr > td:nth-child(2) > a").each((index, element) => {
            // let link = $(this).find('a').attr('href');
            let url = "http://www.pseb.ac.in";
            let link = url + $(element).attr("href").trim();
            let name = $(element).text();
            // console.log("Name: " + name + "\nLink: " + link);
            SHEET.push([link, name]);
        });

        console.log(`Page ${i}`);
    }
    
    console.log("Not Done");
    const ws = fs.createWriteStream("output.csv");
    fastcsv.write(SHEET).pipe(ws);
    
    // await page.screenshot({ path: "myFirst.png" });
    await browser.close();
}

scrape();