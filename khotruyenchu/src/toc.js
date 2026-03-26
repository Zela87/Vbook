load("config.js");

function execute(url) {
    // Đảm bảo URL đầy đủ
    url = url.indexOf('http') === 0 ? url : BASE_URL + url;

    var list = [];
    var currentUrl = url;

    while (currentUrl) {
        var doc = bypass(currentUrl, Http.get(currentUrl).html());
        if (!doc) return Response.error("Không tải được dữ liệu từ trang: " + currentUrl);

        // Lấy danh sách chương trên trang hiện tại
        var articles = doc.select("article.entry-card");
        for (var i = 0; i < articles.size(); i++) {
            var a = articles.get(i).select("h2.entry-title a").first();
            if (a) {
                list.push({
                    name: a.text(),
                    url: a.attr("href"),
                    host: BASE_URL,
                });
            }
        }

        // Kiểm tra có trang tiếp theo không (thẻ <a class="next page-numbers">)
        var nextEl = doc.select("a.next.page-numbers").first();
        currentUrl = nextEl ? nextEl.attr("href") : null;
    }

    return Response.success(list);
}