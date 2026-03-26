function execute(url) {
    let response = Http.get(url).html();
    
    if (response) {
        // 1. Lấy tên truyện
        let name = response.select(".truyen-title").text();
        
        // 2. Lấy tác giả (Lấy text trong thẻ a của span đầu tiên trong truyen-meta)
        let author = response.select(".truyen-meta span").first().select("a").text();
        
        // 3. Lấy thể loại (Duyệt qua các thẻ a trong span thứ 2 của truyen-meta)
        let genres = [];
        let genreSpans = response.select(".truyen-meta span");
        if (genreSpans.size() >= 2) {
            genreSpans.get(1).select("a").forEach(genre => {
                let href = genre.attr("href");
                genres.push({
                    title: genre.text().replace(" - ", ""), // Xóa dấu gạch ngang nếu có
                    input: href.indexOf('http') === 0 ? href : "https://khotruyenchu.sbs" + href,
                    script: "gen.js"
                });
            });
        }

        // 4. Lấy mô tả
        let description = response.select(".truyen-desc").html();

        // 5. Lấy ảnh bìa (Xử lý Lazy Load như đã thảo luận)
        let img = response.select(".truyen-cover img").first();
        let cover = img ? (img.attr("data-src") || img.attr("src")) : "";
        if (cover && cover.startsWith("/")) {
            cover = "https://khotruyenchu.sbs" + cover;
        }

        // 6. Kiểm tra trạng thái (Lấy text ở span thứ 3: "Tình trạng: ...")
        let status = "";
        if (genreSpans.size() >= 3) {
            status = genreSpans.get(2).text().toLowerCase();
        }
        let ongoing = status.indexOf("hoàn thành") === -1 && status.indexOf("full") === -1;

        return Response.success({
            name: name,
            author: author,
            description: description,
            cover: cover,
            genres: genres,
            ongoing: ongoing,
            host: "https://khotruyenchu.sbs"
        });
    }
    return null;
}