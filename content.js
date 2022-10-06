chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  
  console.log("Starting")
  //divs = $('div.issue-item__content-right')
  const divs = $('div.issue-item')
  console.log(divs.length)

  papers = divs.map(function(i) {
    const item = divs[i]
    //console.log(i)

    author_plus_button = item.querySelector("a.removed-items-count")
    simulateClick(author_plus_button)


    const type_element = item.querySelector("div.issue-heading")
    const published_element = item.querySelector("div.bookPubDate")
    const title_element = item.querySelector("h5.issue-item__title > span > a")
    const author_element = item.querySelectorAll("ul.loa > li > a[title]")
    const pub_detail_element = item.querySelector("div.issue-item__detail > a")

    const all_data = {
      type: type_element.textContent,
      title: title_element.textContent,
      authors: [...author_element].map((author) => author.title).join(", "),
      booktitle: pub_detail_element ? pub_detail_element.attributes.title.value : "",
      published_date: published_element.attributes["data-title"].value.slice(11),
      acm_url: title_element.href,
      doi: title_element.href.split("/").slice(-2).join("/")
    }

    return all_data
  })
  console.log(papers)

  const csvString = convertToCSV(papers.toArray())

  //console.log(csvString)

  const blob = new Blob([csvString], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "papers.tsv");
  
  sendResponse("ok")
});

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr)

  return array.map(it => {
    return Object.values(it).join("\t")
  }).join('\n')
}

function simulateClick(theButton) {

  if (!(theButton)) return

  var simulateMouseEvent = function(element, eventName, coordX, coordY) {
  element.dispatchEvent(new MouseEvent(eventName, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: coordX,
    clientY: coordY,
    button: 0
  }));
};

var box = theButton.getBoundingClientRect(),
        coordX = box.left + (box.right - box.left) / 2,
        coordY = box.top + (box.bottom - box.top) / 2;

simulateMouseEvent (theButton, "mousedown", coordX, coordY);
simulateMouseEvent (theButton, "mouseup", coordX, coordY);
simulateMouseEvent (theButton, "click", coordX, coordY);
}