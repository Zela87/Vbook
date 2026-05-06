load('config.js');

function execute(key, page) {
    if (!page) page = '1';
    
    // Cấu trúc tìm kiếm: domain/?s=keyword&post_type=wp-manga
    // Thêm post_type để lọc chính xác kết quả là truyện (manga)
    let fetchUrl = BASE_URL + "/";
    if (page !== '1') {
        fetchUrl += "page/" + page + "/";
    }
    fetchUrl += "?s=" + encodeURIComponent(key) + "&post_type=wp-manga";

    let response = fetch(fetchUrl, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
    });

    if (response.ok) {
        let doc = response.html();
        const data = [];
        
        // Madara dùng class .c-tabs-item__content hoặc .search-wrap cho kết quả tìm kiếm
        // Nhưng thường các trang clone sẽ dùng chung .page-item-detail
        const el = doc.select(".c-tabs-item__content, .page-item-detail");

        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let titleEl = e.select(".post-title a").first();
            let imgEl = e.select(".item-thumb img").first();
            
            if (titleEl.text()) {
                data.push({
                    name: titleEl.text().trim(),
                    link: titleEl.attr("href"),
                    cover: imgEl.attr("data-src") || imgEl.attr("src"),
                    description: e.select(".chapter-item a").first().text().trim(),
                    host: BASE_URL
                });
            }
        }

        // Tính toán phân trang
        let next = "";
        let nextEl = doc.select(".nav-links .current + a, .pagination .active + li a");
        if (!nextEl.isEmpty()) {
            next = (parseInt(page) + 1).toString();
        }

        return Response.success(data, next);
    }
    return null;
}