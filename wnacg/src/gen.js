function execute(url, page) {
    if (!page) page = '1';
    var fetchUrl = url;

    // Nối tên miền nếu là link tương đối
    if (fetchUrl.indexOf("http") !== 0) fetchUrl = "https://wnacg.com" + fetchUrl;

    // Xử lý phân trang
    if (page !== '1') {
        fetchUrl = fetchUrl.replace(".html", "-index-page-" + page + ".html");
    }

    // Dùng fetch thay cho Http.get để tránh lỗi .header()
    var response = fetch(fetchUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var el = doc.select(".gallary_item");
        var data = [];

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            var a = e.select(".title a").first();
            var img = e.select("img").first();
            
            var cover = img.attr("data-original") || img.attr("src");
            if (cover && cover.indexOf("//") === 0) cover = "https:" + cover;

            if (a) {
                data.push({
                    name: a.text().trim(),
                    link: "https://wnacg.com" + a.attr("href"),
                    cover: cover,
                    description: e.select(".info_col").text().trim(),
                    host: "https://wnacg.com"
                });
            }
        }

        var next = data.length > 0 ? (parseInt(page) + 1).toString() : "";
        return Response.success(data, next);
    }
    return null;
}