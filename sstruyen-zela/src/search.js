load('config.js');
load('utils.js');

function execute(key, page) {
    page = (page !== undefined && page !== null) ? page : '1';
    let fetchUrl = BASE_URL + "/tim-kiem";
    
    let response = fetch(fetchUrl, {
        method: "GET",
        queries: {
            s: key,
            page: page
        }
    });

    if (!response.ok) {
        return Response.error("Search request failed: " + response.status);
    }

    let doc = response.html();

    // Redirect detection: site redirects exact match to detail page
    // check for book-info-pic or title class on detail page
    if (doc.select(".book-info-pic").size() > 0 && doc.select(".scrolltext").size() > 0) {
        let titleEl = doc.select("h1, .title").first();
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
    // sstruyen uses div.phan-trang or div.paging. Look for button containing ❭
    let nextEl = doc.select("div.phan-trang a:contains(❭), div.paging a:has(span:contains(›)), .next.page-numbers").first();
    if (nextEl) {
        next = String(parseInt(page) + 1);
    }

    return Response.success(novelList, next);
}
