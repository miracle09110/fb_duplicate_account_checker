const puppeteer = require('puppeteer');

const maleDefaultDP = "https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.30497-1/c141.0.480.480a/p480x480/84241059_189132118950875_4138507100605120512_n.jpg?_nc_cat=1&_nc_sid=7206a8&_nc_eui2=AeEqI6OYmIGNlw0jTefaB4tmLYw35eBBIRQtjDfl4EEhFIMk82TpqAmmtsGfzNVsal4&_nc_ohc=-PIzNlCh8LAAX-uFxfQ&_nc_ht=scontent.fmnl8-1.fna&oh=a2db7c3764f2da46d4d107221bb531ea&oe=5F015488";
const femaleDefaultDP ="https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.30497-1/c141.0.480.480a/p480x480/84688533_170842440872810_7559275468982059008_n.jpg?_nc_cat=1&_nc_sid=7206a8&_nc_eui2=AeGwxdpAns8Ea9jYvh83QQznwBqKCN3Pzv_AGooI3c_O_8_3X9jOsKLqrUS0inksEOo&_nc_ohc=PgSc7iSS3nUAX95o3Ar&_nc_ht=scontent.fmnl8-1.fna&oh=2d21dcb6cf79776aa92efe5316a0dfd3&oe=5F023B58";

(async () => {
  console.log('Preparing FB Dummy Checker...');
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
  try {
    await page.goto('https://facebook.com');
    await page.screenshot({ path: './screenshots/page.png' });
    await page.waitFor('input[name=email]');
    await page.waitFor('input[name=pass]');

    await page.$eval('input[name=email]', (el) => (el.value = ``));//TODO: ADD FB USER NAME
    await page.$eval('input[name=pass]', (el) => (el.value = ``)); //TODO: ADD FB PASSWORD
     await page.screenshot({ path: './screenshots/creds.png' });
    await page.waitFor('input[type="submit"]');
    await page.click('input[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }),
    await page.screenshot({ path: './screenshots/login.png' });

    await page.waitFor('input[placeholder="Search Facebook"]');
    await page.click('input[placeholder="Search Facebook"]');
    await page.screenshot({ path: './screenshots/clicksearch.png' });

    const keywords = '' //TODO: add keywords
    await page.screenshot({ path: './screenshots/search.png' });
    console.log('Searching...');
    await page.goto(`https://www.facebook.com/search/people/?q=${keywords.toLocaleLowerCase().replace(' ','%20')}`);
    await page.screenshot({ path: './screenshots/searchresult.png' });

    
    const scrolldown = async () => {
      let keepScrolling = true;
      let iterator = 0;
      while (keepScrolling) {
        console.log('Scrolling....');
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });

        console.log('Loading....');
        await page.screenshot({ path: `./screenshots/scroll${iterator}.png` });

        const spanTexts = await page.evaluate(() =>
          Array.from(document.body.querySelectorAll('span'), (el) => {
            return el.innerText;
          })
        );

        console.log(`Info gathered: ${spanTexts.length}`);
        if (spanTexts.indexOf('End of Results') > -1 || iterator === 50) {
          console.log('End of Search Results');
          keepScrolling = false;
          return;
        }
        iterator++;
      }
    }
  
    await scrolldown();
    const hrefs = await page.evaluate(() =>
      Array.from(document.body.querySelectorAll('a'), (el) =>
        el.getAttribute('href')
      )
    );

    console.log(`Account Links Found ${hrefs.length}`);
    const filter = async (links) => {
      const possibleNewAccounts = await links.reduce((array, link) => {
        if (link.includes`${keywords.toLocaleLowerCase().replace(' ', '.')}.`) {
          array.push(link);
        }
        return array;
      },[]);

      return possibleNewAccounts;
    }

    console.log(`Looking for possible duplicates...`);
    const filteredLinks = await filter(hrefs);
    console.log(`Possible duplicates ${filteredLinks.length}`);
  
    const getPossibleDummy = async (links) => {
      const dummies = [];
      for(const link of links){
        console.log(`Checking ${link}...`);
        await page.goto(link);

        const images = await page.evaluate(() =>
          Array.from(document.body.querySelectorAll('img'), (el) => {
            return el.getAttribute('src');
          })
      );

        const texts = await page.evaluate(() =>
           Array.from(document.body.querySelectorAll('span'), (el) => {
             return el.innerText;
           })
         );

        if (
          images.indexOf(femaleDefaultDP) > -1 ||
          images.indexOf(maleDefaultDP) > -1 ||
          texts.indexOf('No posts available') > -1
        ){
          dummies.push(link);
          console.log(`${link} is a possible dummy account!`);
        }
       
      }

      return dummies;
    }
   
    const dummies = await getPossibleDummy(filteredLinks);
    console.log(`Here are possible duplicate accounts`);
    console.log(dummies);
    await browser.close();
  }catch (err){
    console.log(err);
    await browser.close();
  }
 
})();
