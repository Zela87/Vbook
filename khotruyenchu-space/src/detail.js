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

        let nameEl = doc.select("h1, .entry-title").first();
        let name = nameEl ? nameEl.text().replace("Bộ truyện", "").trim() : "";

        let coverEl = doc.select(".truyen-cover img, .hs-thumb img, .entry-content img").first();
        let cover = coverEl ? (coverEl.attr("data-src") || coverEl.attr("src")) : "";

        let authorEl = doc.select("a[href*='tac-gia']").first();
        let author = authorEl ? authorEl.text().trim() : "";

        let descEl = doc.select(".truyen-desc, .entry-content").first();
        let description = descEl ? Html.clean(descEl.html(), ["p", "br", "b", "i", "em", "strong"]) : "";

        let ongoing = doc.html().indexOf("Còn tiếp") >= 0 || doc.html().indexOf("Đang ra") >= 0;

        let genres = [];
        doc.select("a[href*='/the-loai/']").forEach(function(el) {
            let gTitle = el.text().trim();
            if (gTitle && gTitle.length < 30) {
                genres.push({
                    title: gTitle,
                    input: el.attr("href"),
                    script: "gen.js"
                });
            }
        });

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
