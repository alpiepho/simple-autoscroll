var scrolling = false
function click(e) {
    chrome.browserAction.setIcon({ path: 'green.png' }, () => {
    var sec = document.getElementById('scroll-seconds').value
    var scroll = document.getElementById('scroll-scroll').value
    
    var choices = document.querySelectorAll('input[name="scroll-choice"]');
    console.log(choices)
    for (choice of choices) {
        if (choice.checked) {
          if (choice.value == "up") scroll = -1*scroll;
        }
    }

    chrome.tabs.executeScript(null, {
      code: "try{clearTimeout(t)}catch{};console.log('Stopped');",
    })

    if (scrolling) {
      scrolling = false;
      document.getElementById('scroll-down').innerText = 'Go';
    } else {
      scrolling = true;
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

    //leave control window open until usr clicks away
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
