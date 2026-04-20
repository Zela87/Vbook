load ('config.js');

function execute() {
    let response = fetch(BASE_URL); // Hoặc URL cụ thể chứa danh mục thể loại
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        
        // Nhắm vào các thẻ <a> trong div có class chia ngăn 'divide-y'
        doc.select("div.divide-y a[href*='/the-loai/']").forEach(function(el) {
            let title = el.text().trim();
            let href = el.attr("href");

            // Loại bỏ các mục trùng lặp lỗi (hai-hoc) hoặc mục chung (Tất Cả)
            if (title && title !== "hai-hoc" && title !== "Tất Cả") {
                genres.push({
                    title: title,
                    input: href.startsWith("http") ? href : BASE_URL + href,
                    script: "gen.js"
                });
            }
        });

        return Response.success(genres);
    }
    return null;
}