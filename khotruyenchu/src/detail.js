load('config.js');

// Hàm chính để lấy thông tin chi tiết truyện
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = bypass(url, Http.get(url).html());
    if (doc) {
        // Lấy URL ảnh bìa (ưu tiên data-src, fallback sang src)
        var coverEl = doc.select(".truyen-cover img").first();
        var cover = coverEl.attr("data-src") || coverEl.attr("src");
        if (cover.startsWith("//")) {
            cover = "https:" + cover;
        }

        // Lấy danh sách thể loại từ .truyen-meta a
        let genres = [];
        doc.select(".truyen-meta span:nth-child(2) a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr('href').replace(/^https?:\/\/[^\/]+/, ''),
                script: "gen.js"
            });
        });

        // Lấy tác giả: thẻ <a> đầu tiên trong .truyen-meta (span tác giả)
        var author = doc.select(".truyen-meta span:first-child a").text();

        // Kiểm tra tình trạng truyện
        var ongoing = doc.select(".truyen-meta").html().toLowerCase().indexOf("đang tiến hành") >= 0;

        return Response.success({
            name: doc.select(".truyen-title").text(),
            cover: cover,
            host: BASE_URL,
            author: author,
            description: doc.select(".truyen-desc").text(),
            ongoing: ongoing,
            genres: genres
        });
    }

    return Response.error("Không tải được dữ liệu");
}