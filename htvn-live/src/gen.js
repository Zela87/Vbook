load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    
    // Madara theme thường dùng cấu trúc /page/n/
    let fetchUrl = url;
    if (page !== '1') {
        if (fetchUrl.endsWith("/")) fetchUrl = fetchUrl.slice(0, -1);
        fetchUrl += "/page/" + page + "/";
    }

    let response = fetch(fetchUrl, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
    });

    if (response.ok) {
        let doc = response.html();
        const data = [];
        
        // Selector cho từng item truyện trong danh sách
        const el = doc.select(".item");

        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let titleEl = e.select("figcaption h3 a").first();
            let imgEl = e.select(".image img").first();
            
            // Lấy chapter mới nhất để làm description cho đẹp
            let lastChapter = e.select("ul.comic-item li.chapter a").first().text().trim();

            data.push({
                name: titleEl.text().trim(),
                link: titleEl.attr("href"),
                cover: imgEl.attr("data-original") || imgEl.attr("src"),
                description: lastChapter ? "Mới nhất: " + lastChapter : "",
                host: BASE_URL
            });
        }

        // Tính toán trang tiếp theo
        // Tìm link trang tiếp theo trong pagination
        let next = "";
        let nextEl = doc.select(".pagination a[rel='next']");
        if (!nextEl.isEmpty()) {
            let nextHref = nextEl.attr("href");
            let match = nextHref.match(/[?&]page=(\d+)/);
            if (match) {
                next = match[1];
            }
        }

        return Response.success(data, next);
    }
    return null;
}