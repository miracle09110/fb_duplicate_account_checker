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
  getAnchorFunc:() => {
    let achors = [...document.querySelectorAll('a')]
    return achors.map((link) => link.getAttribute('href'))
  },
  getImgFunc:() => {
    let achors = [...document.querySelectorAll('img')]
    return achors.map((link) => link.getAttribute('src'))
  }
};