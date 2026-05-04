load('config.js');
function execute(url) {
  let response = fetch(url);
  if (response.ok) {
    let doc = response.html();
    let list = [];
    let el = doc.select(".nav-previous .float-left");
    if (el.size() > 0) {
      let page = 1;
      pagination.forEach(function (el) {
        let p = parseInt(el.text());
        if (p > page) page = p;
      });

      let baseUrl = url;
      if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);

      for (let p = 2; p <= page; p++) {
        list.push(baseUrl + "/page/" + p + "/");
      }
    }
    return Response.success(list);
  }

  return null;
}
