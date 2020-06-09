const puppeteer = require('puppeteer');
const prompts = require('prompts');
const path = require('path');
const eval = require('./eval');
const maleDefaultDP = "https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.30497-1/c141.0.480.480a/p480x480/84241059_189132118950875_4138507100605120512_n.jpg?_nc_cat=1&_nc_sid=7206a8&_nc_eui2=AeEqI6OYmIGNlw0jTefaB4tmLYw35eBBIRQtjDfl4EEhFIMk82TpqAmmtsGfzNVsal4&_nc_ohc=-PIzNlCh8LAAX-uFxfQ&_nc_ht=scontent.fmnl8-1.fna&oh=a2db7c3764f2da46d4d107221bb531ea&oe=5F015488";
const femaleDefaultDP ="https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.30497-1/c141.0.480.480a/p480x480/84688533_170842440872810_7559275468982059008_n.jpg?_nc_cat=1&_nc_sid=7206a8&_nc_eui2=AeGwxdpAns8Ea9jYvh83QQznwBqKCN3Pzv_AGooI3c_O_8_3X9jOsKLqrUS0inksEOo&_nc_ohc=PgSc7iSS3nUAX95o3Ar&_nc_ht=scontent.fmnl8-1.fna&oh=2d21dcb6cf79776aa92efe5316a0dfd3&oe=5F023B58";

const properties = [
  {
    type: 'text',
    name: 'username',
    message: `What's your facebook user?`,
    validate: (value) => (!value ? `Please input user` : true),
  },
  {
    type: 'password',
    name: 'password',
    message: `FB password (This will not leave your local machine)`,
    validate: (value) => (!value ? `Please input password` : true),
  },
  {
    type: 'text',
    name: 'search',
    message: `Name to search (separate with spaces)`,
    validate: value => value.split(' ').length <= 1 ?  'Please input name to search with spaces' : true
  },
];

let username = ''
let password = '';
let keywords = '' ; 
let rerun = false;
let searchAgain = false; 

const numberOfScrollIterations = 2000; //TODO: Change as needed
console.log(' *** HELLO! I AM THE FB DUPLICATE ACCOUNT DETECTOR AND I HATE TROLLS ***');
console.log();
console.log();
console.log();
console.log('*                     *');
console.log(' *                   *');
console.log('  *                 *');
console.log('   *               *');
console.log('    *             *');
console.log('     *   *  *    *');
console.log('****** ******** ******');
console.log('       ********');
console.log('****** ******** ******');
console.log('     *          *');
console.log('    *            *');
console.log('   *              *');
console.log('  *                *');
console.log(' *                  *');
console.log('*                    *');
console.log();
console.log();
console.log(' *** I run purely on your Machine ***');
console.log(' *** Whatever happens with us, stays with us ***');


(async () => {
  // https://github.com/vercel/pkg/issues/204
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH ||
    (process.pkg
      ? path.join(
          path.dirname(process.execPath),
          'puppeteer',
          ...puppeteer
            .executablePath()
            .split(path.sep)
            .slice(6), 
        )
      : puppeteer.executablePath());

  const answers = await prompts(properties, {
    onCancel: () => { return 0 } 
  });

  username = answers.username;
  password = answers.password;
  keywords = answers.search;
  if (!username || !password){
    return;
  }
  console.log('Preparing FB Dummy Checker...');



  
  const browser = await puppeteer.launch({
    executablePath,
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://facebook.com');
    // await page.screenshot({ path: './screenshots/page.png' });
    await page.waitFor('input[name=email]');
    await page.waitFor('input[name=pass]');
    await page.evaluate(eval.setUserfunc, username); //TODO: ADD FB USER NAME
    await page.evaluate(eval.setPasswordfunc, password); //TODO: ADD FB USER NAME
    // await page.screenshot({ path: './screenshots/login.png' });
    await page.waitFor('input[type="submit"]');
    await page.click('input[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
  }catch (err){
    console.log(`Something went wrong in logging your account`);
    console.log('err (show me to the devs!):>> ', err);
    await browser.close();
    return;
  }


while (searchAgain || !rerun) {
  if (rerun) {
    const newSearch = await prompts(properties[2]);
    keywords = newSearch.search;
  
  }
  try {    
    console.log(`Searching for ${keywords}...`);
    await page.goto(`https://www.facebook.com/search/people/?q=${keywords.toLowerCase().replace(' ','%20')}`);
    // await page.screenshot({ path: './screenshots/searchresult.png' });

    
    const scrolldown = async () => {
      let keepScrolling = true;
      let iterator = 0;
      while (keepScrolling) {
        console.log('Scrolling....');
        await page.evaluate(eval.scrollFunc);

        // await page.screenshot({ path: `./screenshots/scroll${iterator}.png` });
        const spanTexts = await page.evaluate(eval.getSpanFunc);

        console.log(`Info gathered: ${spanTexts.length}`);
        if (spanTexts.indexOf('End of Results') > -1 || iterator === numberOfScrollIterations) {
          console.log('End of Search Results');
          keepScrolling = false;
          return;
        }
        iterator++;
      }
    }
  
    await scrolldown();
    const hrefs = await page.evaluate(eval.getAnchorFunc);

    console.log(`Account Links Found ${hrefs.length}`);
    const filter = async (links) => {
      const possibleNewAccounts = await links.reduce((array, link) => {
        if (link.includes(`${keywords.toLowerCase().replace(' ', '.')}.`)) {
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

        const images = await page.evaluate(eval.getImgFunc);

        const texts = await page.evaluate(eval.getSpanFunc);

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
    
    const again = await prompts({ 
          type: 'confirm',
          name: 'confirmed',
          message: 'Search Again?'
    });

    searchAgain = again.confirmed;
    console.log(`Searching Again ${searchAgain}`);
    if (!searchAgain){
      await browser.close();
      return;
    }
    
    rerun = true;

  }catch (err){
    console.log(`**** I\'m sorry I failed, please make sure you have the right credentials`);
    console.log('err (show me to the devs!):>> ', err);
    await browser.close();
    return
  }
}
 
})();
