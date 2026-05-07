load('config.js');

function execute(url) {
    let response;
    try {
        response = fetch(url);
    } catch (e) {
        return Response.error("Lỗi kết nối: " + e.message);
    }

    if (!response.ok) {
        return Response.error("HTTP " + response.status);
    }

    try {
        let doc = response.html();

        // Lấy tên truyện từ thẻ h1
        let name = doc.select("h1").text().trim();

        // Lấy ảnh bìa
        let cover = doc.select("img.rounded.shadow").attr("src");

        // Lấy tác giả (tìm text sau icon user hoặc chứa cụm 'Tác giả')
        let author = "";
        doc.select("p").forEach(function(el) {
            if (el.text().indexOf("Tác giả:") >= 0) {
                author = el.text().replace("Tác giả:", "").trim();
            }
        });

        // Lấy mô tả truyện (guard null trước khi gọi .html())
        let descEl = doc.select(".mt-10 p.text-gray-700").first();
        let description = descEl ? Html.clean(descEl.html(), ["p", "br", "b", "i", "em", "strong"]) : "";

        // Kiểm tra trạng thái truyện (Ongoing/Completed)
        let ongoing = doc.html().indexOf("Đang cập nhật") >= 0;

        // Lấy danh sách thể loại — split đúng từng thể loại riêng lẻ
        let genres = [];
        doc.select("span").forEach(function(el) {
            let text = el.text();
            if (text.indexOf("Thể loại:") >= 0) {
                let raw = text.replace("Thể loại:", "").trim();
                let parts = raw.split(",");
                for (let i = 0; i < parts.length; i++) {
                    let gTitle = parts[i].trim();
                    if (gTitle && gTitle.length < 50) {
                        genres.push({
                            title: gTitle,
                            input: BASE_URL + "/the-loai/" + encodeURIComponent(gTitle.toLowerCase().replace(/\s+/g, '-')),
                            script: "gen.js"
                        });
                    }
                }
            }
        });

        // Gợi ý tìm kiếm theo tác giả
        let suggests = [];
        if (author) {
            suggests.push({
                title: "Truyện của " + author,
                input: author,
                script: "search.js"
            });
        }

        return Response.success({
            name: name,
            cover: cover,
            host: BASE_URL,
            author: author,
            description: description,
            detail: "",
            ongoing: ongoing,
            genres: genres,
            suggests: suggests
        });
    } catch (e) {
        return Response.error("Lỗi phân tích trang: " + e.message);
    }
}