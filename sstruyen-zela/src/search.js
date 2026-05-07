load('config.js');
load('utils.js');
function execute(key, page) {
    page = page !== undefined ? page : '1';
    let fetchUrl = BASE_URL + "/";
    if (page !== '1') {
        fetchUrl += "?paged=" + page;
    }
    let response = fetch(fetchUrl, {
        method: "GET",
        queries: {
            s: key
        }
    });

    if (!response.ok) {
        return Response.error("Search request failed: " + response.status);
    }

    let doc = response.html();

    // Redirect detection: site redirects exact match to detail page
    // Use .size() > 0 on Elements (not .first() on Element) per spec pattern
    if (doc.select("h1, .entry-title").size() > 0 && doc.select(".entry-content").size() > 0) {
        let titleEl = doc.select("h1, .entry-title").first();
        let name = titleEl ? titleEl.text().replace("Bộ truyện", "").trim() : "";
        let link = response.url;
        let coverEl = doc.select(".book-info-pic img").first();
        let cover = coverEl ? (coverEl.attr("data-src") || coverEl.attr("src")) : "";
        return Response.success([{
            name: name,
            link: link,
            cover: cover,
            host: BASE_URL
        }]);
    }

    let novelList = parseNovelList(doc);

    // Pagination: detect next page link
    let next = "";
    let nextEl = doc.select("div.paging a:has(span:contains(›)), div.phan-trang a:contains(❭), .next.page-numbers").first();
    if (nextEl) {
        next = String(parseInt(page) + 1);
    }

    return Response.success(novelList, next);
}
