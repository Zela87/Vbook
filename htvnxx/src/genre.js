load('config.js');

function execute() {
    // Gọi trực tiếp đến trang danh sách thể loại
    let response = fetch(BASE_URL + "/the-loai-hentai/");
    
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        
        // Madara Theme thường bọc các thể loại trong .shortcode-alltags hoặc .layout-list
        doc.select(".shortcode-alltags .item a.title").forEach(function(el) {
            // Lấy text trong thẻ h3 (ví dụ: "18+ (7315)")
            let rawTitle = el.select("h3").text().trim();
            
            // Dùng Regex để loại bỏ phần số lượng trong ngoặc ở cuối, ví dụ " (7315)"
            let cleanTitle = rawTitle.replace(/\s\(\d+\)$/, "");
            
            let link = el.attr("href");

            if (cleanTitle && link) {
                genres.push({
                    title: cleanTitle,
                    input: link,
                    script: "gen.js"
                });
            }
        });

        return Response.success(genres);
    }
    
    return null;
}