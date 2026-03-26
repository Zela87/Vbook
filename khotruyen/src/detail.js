function execute(url) {
    // Sử dụng Http.get trực tiếp (loại bỏ bypass để tránh lỗi ReferenceError)
    let response = Http.get(url).html();
    
    if (response) {
        // 1. Lấy tên truyện
        let name = response.select("h1.truyen-title").text().trim();
        
        // Nếu không lấy được tên, app sẽ báo lỗi "không lấy được thông tin"
        if (!name) return null;

        // 2. Lấy tác giả: Tìm span chứa chữ "Tác giả" sau đó lấy text trong thẻ a
        let author = "";
        let metaSpans = response.select(".truyen-meta span");
        metaSpans.forEach(span => {
            if (span.text().indexOf("Tác giả") !== -1) {
                author = span.select("a").text().trim();
            }
        });
        if (!author) author = "Đang cập nhật";

        // 3. Lấy thể loại
        let genres = [];
        metaSpans.forEach(span => {
            if (span.text().indexOf("Thể loại") !== -1) {
                span.select("a").forEach(genre => {
                    let gName = genre.text().trim();
                    if (gName) {
                        genres.push({
                            title: gName.replace("-", "").trim(),
                            input: "https://khotruyenchu.sbs" + genre.attr("href"),
                            script: "gen.js"
                        });
                    }
                });
            }
        });

        // 4. Lấy mô tả
        let description = response.select(".truyen-desc").html();

        // 5. Lấy ảnh bìa
        let img = response.select(".truyen-cover img").first();
        let cover = img ? (img.attr("data-src") || img.attr("src")) : "";
        if (cover && cover.startsWith("/")) {
            cover = "https://khotruyenchu.sbs" + cover;
        }

        // 6. Kiểm tra trạng thái
        let ongoing = true;
        metaSpans.forEach(span => {
            if (span.text().indexOf("Tình trạng") !== -1) {
                let statusText = span.text().toLowerCase();
                if (statusText.indexOf("hoàn thành") !== -1 || statusText.indexOf("full") !== -1) {
                    ongoing = false;
                }
            }
        });

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