load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        let nameEl = doc.select("h1, .truyen-title").first();
        let name = nameEl ? nameEl.text().replace("Bộ truyện", "").trim() : "";
        let coverEl = doc.select(".book-info-pic img").first();
        let cover = coverEl ? (coverEl.attr("data-src") || coverEl.attr("src")) : "";
        let authorEl = doc.select("a[href*='tac-gia']").first();
        let author = authorEl ? authorEl.text().trim() : "";
        let descEl = doc.select(".scrolltext").first();
        let description = descEl ? descEl.html() : "";
        let ongoing = doc.html().indexOf("Đang cập nhật") >= 0 || doc.html().indexOf("Hoan thành") >= 0;
        
        let genres = [];
        
        let bookInfoArea = doc.select(".book-info, .truyen-info, .info-content").first();
        if (bookInfoArea) {
            bookInfoArea.select("a[href*='/the-loai/']").forEach(function(el) {
                let gTitle = el.text().trim();
                if (gTitle && gTitle.length < 30) {
                    genres.push({
                        title: gTitle,
                        input: el.attr("href"),
                        script: "gen.js"
                    });
                }
            });
        }

        return Response.success({
            name: name,
            cover: cover,
            host: BASE_URL,
            author: author,
            description: description,
            ongoing: ongoing,
            genres: genres
        });
    }
    return null;
}
