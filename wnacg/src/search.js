function execute(key, page) {
    if (!page) page = '1';
    
    // URL tìm kiếm chuẩn của Wnacg
    // q: từ khóa, p: số trang
    var url = "https://wnacg.com/search/index.php?q=" + key + "&m=&syn=yes&f=_all&s=create_time_DESC&p=" + page;

    var response = fetch(url, {
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

        // Kiểm tra xem còn trang sau không
        var next = data.length > 0 ? (parseInt(page) + 1).toString() : "";
        return Response.success(data, next);
    }
    return null;
}