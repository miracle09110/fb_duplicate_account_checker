module.exports = {
  parseStringFunc(name){
    return this.FUNC_STRINGS[name]
  },
  FUNC_STRINGS: {
    EVAL_USERNAME : `(username) => {
      console.log('flag')
      return document.querySelector('input[name=email]').value = username;
    }`,
    EVAL_PASSWORD: `(password) => {
      document.querySelector('input[name=pass]').value = password;
    }`,
    EVAL_WINDOW_SCROLL: `() => {
      window.scrollBy(0, window.innerHeight);
    }`,
    EVAL_GET_SPANS: `() => 
      Array.from(document.body.querySelectorAll('span'), (el) => {
        return el.innerText;
      })
    `,
    EVAL_GET_HREFS: `() =>
    Array.from(document.body.querySelectorAll('a'), (el) =>
      el.getAttribute('href')
    )`,
    EVAL_GET_SOURCES: `() =>
      Array.from(document.body.querySelectorAll('img'), (el) => {
        return el.getAttribute('src');
      })
    `,
    
  }
}