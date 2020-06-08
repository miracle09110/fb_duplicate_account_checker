# FB Duplicate Account Checker

Checks for duplicate accounts of FB. Written in Javascript

## Dependencies
- Node Version: 14 or higher
- Puppeteer 


## Compatibility
Latest FB UI only. Backward compatibility to other UI version is not supported

## Installation
```
npm install
```

## Running
```
node app.js
```

## Limitations
- This application depends on `actual` user credentials for FB authentication. You would need to load `username`, `password` and `keyword` to actually search. These inputs are currently marked in code base with a `TODO`

- There is a variable within the code called `numberOfScrollIterations`. This is how many times it scrolls through a page. I added a limit because there are instances where you enter 'infinite scroll' mode on FB. Change it as needed. Variable also marked with `TODO`

### Searching for friends' duplicate accounts
Since this is loaded with your user credentials, you can search duplicates for your fb friends too. Simply change the `keyword` variable to the name of your friend

#### Further improvements
- UI
- Environment variable based searching
- Business logic for filtering actual vs fake accounts
