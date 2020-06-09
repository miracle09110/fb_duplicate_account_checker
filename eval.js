module.exports = {
  getSpanFunc: () => {
    let spans = [...document.querySelectorAll('span')];
    return spans.map((span) => span.innerText);
  },
  setUserfunc: (username) => {
    return document.querySelector('input[name=email]').value = username;
  },
  setPasswordfunc: (password) => 
      document.querySelector('input[name=pass]').value = password
  ,
  scrollFunc: () => {
    window.scrollBy(0, window.innerHeight);
  },
  getAnchorFunc:() =>
    Array.from(document.body.querySelectorAll('a'), (el) =>
      el.getAttribute('href')
    )
  ,
  getImgFunc: () =>
      Array.from(document.body.querySelectorAll('img'), (el) => {
        return el.getAttribute('src');
    })
};