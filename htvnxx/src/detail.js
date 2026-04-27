load('config.js');

function execute(url) {
    // Đảm bảo URL đúng domain
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    
    let response = fetch(url, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "referer": BASE_URL
        }
    });

    if (response.ok) {
        let doc = response.html();
        
        // 1. Lấy danh sách thể loại
        let genres = [];
        doc.select(".genres-content a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        // 2. Lấy tên tác giả
        let author = doc.select(".author-content a").first().text();
        if (!author) author = "Đang cập nhật";

        // 3. Lấy trạng thái (Còn tiếp hay Hoàn thành)
        // Madara thường để trạng thái trong class .post-status
        let status = doc.select(".post-status").html();
        let ongoing = status.indexOf("OnGoing") !== -1 || status.indexOf("Đang tiến hành") !== -1;

        // 4. Lấy mô tả truyện
        let description = doc.select(".description-summary .summary__content").html();
        if (!description) description = doc.select(".manga-excerpt").html();

        return Response.success({
            name: doc.select(".post-title h1").text().trim(),
            cover: doc.select(".summary_image img").first().attr("data-src") || doc.select(".summary_image img").first().attr("src"),
            author: author,
            description: description,
            host: BASE_URL,
            genres: genres,
            ongoing: ongoing,
            nsfw: true
        });
    }

    return null;
}