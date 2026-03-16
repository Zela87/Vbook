load('config.js');

function execute(url) {
    url = url.indexOf('http') === 0 ? url : BASE_URL + url;
    var doc = bypass(url, Http.get(url).html());

    if (!doc) return Response.error("Không tải được dữ liệu");

    var list = [];
    var el = doc.select("#chapterList a");

    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);
        list.push({
            name: e.select("span.text-ellipsis").text(),
            url: e.attr("href"),
            host: BASE_URL,
        });
    }

    return Response.success(list);
}