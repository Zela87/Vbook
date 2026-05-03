load("config.js");
function execute() {
    // Gọi trực tiếp đến trang danh sách thể loại
    let response = fetch(BASE_URL + "/the-loai-hentai/");
    
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        
        // Lấy các thể loại từ menu .sub-nav_list
        doc.select(".sub-nav_list li a").forEach(function(el) {
            let title = el.text().trim();
            let link = el.attr("href");

            if (title && link) {
                genres.push({
                    title: title,
                    input: link,
                    script: "gen.js"
                });
            }
        });

        return Response.success(genres);
    }
    
    return null;
}