load('config.js');

function execute(url) {
    url = url.indexOf('http') === 0 ? url : BASE_URL + url;

    var response = fetch(url);
    if (!response.ok) return Response.error("Không tải được dữ liệu");

    var doc = response.html();
    var imgs = doc.select("#chapter-content img.chapter-img");
    var data = [];

    for (var i = 0; i < imgs.size(); i++) {
        var e = imgs.get(i);
        var link = e.attr("data-src").trim();
        if (!link) link = e.attr("src").trim();

        if (link && !link.startsWith("data:")) {
            data.push({
                link: link,
                Referer: BASE_URL,
            });
        }
    }

    return Response.success(data);
}