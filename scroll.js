var scrolling = false
function click(e) {
    chrome.browserAction.setIcon({ path: 'green.png' }, () => {
    var sec = document.getElementById('scroll-seconds').value
    var scroll = document.getElementById('scroll-scroll').value
    var start = document.querySelectorAll('input[value="start"]')[0].checked
    var end = document.querySelectorAll('input[value="end"]')[0].checked
    var up = document.querySelectorAll('input[value="up"]')[0].checked
    var down = document.querySelectorAll('input[value="down"]')[0].checked
    

    chrome.tabs.executeScript(null, {
      code: "try{clearTimeout(t)}catch{};console.log('Stopped');",
    })

    if (start || end) {
      scrolling = false;
      document.getElementById('scroll-down').innerText = 'Go';
      if (start) scroll = 0;
      if (end) scroll = 1000000;
      chrome.tabs.executeScript(null, {
        code:
"\
console.log('Scroll " + scroll + " px');\
scroll(0," + scroll + ");\
",
      })

    }
    if (up || down) {
      if (scrolling) {
        scrolling = false;
        document.getElementById('scroll-down').innerText = 'Go';
      } else {
        scrolling = true;
        if (up) scroll = -1*scroll;
        document.getElementById('scroll-down').innerText = 'Pause';
  
        chrome.tabs.executeScript(null, {
          code:
"\
console.log('Scroll " + scroll + " px every " + sec + " milliseconds');\
function addscroll(e){\
  var y=window.pageYOffset!==undefined?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop;\
  scroll(0,y+e)\
}\
function autoscroll(e,n){\
  addscroll(n);\
  t=setTimeout(function(){autoscroll(e,n)},e);\
}\
autoscroll(" + sec + "," + scroll + ");\
",
        })
      }
  
    }

    //leave control window open until user clicks away
    //window.close()
  })
}

function stop() {
  chrome.browserAction.setIcon({ path: 'icon.png' })
  chrome.tabs.executeScript(null, {
    code: "try{clearTimeout(t)}catch{};console.log('stopped');",
  })
}

function saveDefault() {
  const seconds = +document.getElementById('scroll-seconds').value
  const scroll = +document.getElementById('scroll-scroll').value
  document.getElementById('scroll-saved').innerHTML = `Saved &#10003;`

  localStorage.setItem('scroll-scroll', scroll)
  localStorage.setItem('scroll-seconds', seconds)
}

document.addEventListener('DOMContentLoaded', function() {
  stop()
  const scroll = +localStorage.getItem('scroll-scroll') || 5
  const seconds = +localStorage.getItem('scroll-seconds') || 25

  document.getElementById('scroll-seconds').value = seconds
  document.getElementById('scroll-scroll').value = scroll
  document.querySelectorAll('input[value="down"]')[0].checked = true

  document.getElementById('scroll-down').addEventListener('click', click)
  document.getElementById('scroll-default').addEventListener('click', saveDefault)
})
