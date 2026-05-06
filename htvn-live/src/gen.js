load('config.js');
function execute(url, page) {
    if (!page) page = '1';

    // Site dùng ?page=n, không phải /page/n/
    let fetchUrl = url;
    if (page !== '1') {
        if (fetchUrl.endsWith('/')) fetchUrl = fetchUrl.slice(0, -1);
        // Nếu url đã có query string thì dùng &, không thì dùng ?
        fetchUrl += (fetchUrl.indexOf('?') !== -1 ? '&' : '?') + 'page=' + page;
    }

    let response = fetch(fetchUrl, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
    });

    if (response.ok) {
        let doc = response.html();
        const data = [];

        const el = doc.select(".item");

        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let titleEl = e.select("figcaption h3 a").first();
            let imgEl = e.select(".image img").first();

            if (titleEl == null || imgEl == null) continue;

            // FIX: guard null trước khi gọi .text()
            let chapEl = e.select("ul.comic-item li.chapter a").first();
            let lastChapter = chapEl != null ? chapEl.text().trim() : "";

            data.push({
                name: titleEl.text().trim(),
                link: titleEl.attr("href"),
                cover: imgEl.attr("data-original") || imgEl.attr("src"),
                description: lastChapter ? "Mới nhất: " + lastChapter : "",
                host: BASE_URL
            });
        }

        // FIX: tìm link next page đúng selector
        let next = "";
        let nextEl = doc.select(".pagination a[rel=next], .pagination a:contains(›)").first();
        if (nextEl != null) {
            let nextHref = nextEl.attr("href");
            let match = nextHref.match(/[?&]page=(\d+)/);
            if (match) {
                next = String(match[1]); // FIX: ép kiểu String
            }
        }

        return Response.success(data, next);
    }
    return Response.error("Fetch failed: " + fetchUrl);
}
