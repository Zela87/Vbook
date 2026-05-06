load("config.js");
function execute(url, page) {
    if (!page) page = '1';
    
    // Determine dynamic host from input URL
    let currentHost = BASE_URL;
    if (url && url.indexOf('http') === 0) {
        let parts = url.split('/');
        currentHost = parts[0] + "//" + parts[2];
    }

    // Madara theme usually uses /page/n/
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
        
        // Use a more flexible selector for items
        const el = doc.select(".page-item-detail");

        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let titleEl = e.select(".post-title a").first();
            let imgEl = e.select(".item-thumb img").first();
            
            if (titleEl) {
                let name = titleEl.text().trim();
                let link = titleEl.attr("href");
                
                // Normalize link if it's relative
                if (link && link.indexOf("http") !== 0) {
                    if (link.indexOf("/") === 0) link = currentHost + link;
                    else link = currentHost + "/" + link;
                }

                let cover = "";
                if (imgEl) {
                    cover = imgEl.attr("data-src") || imgEl.attr("src") || imgEl.attr("data-original");
                    if (cover && cover.indexOf("http") !== 0) {
                        if (cover.indexOf("//") === 0) cover = "https:" + cover;
                        else cover = currentHost + (cover.indexOf("/") === 0 ? "" : "/") + cover;
                    }
                }
                
                // Robust last chapter selection
                let lastChapter = "";
                let chapterEl = e.select(".chapter-item a, a.btn-link").first();
                if (chapterEl) {
                    lastChapter = chapterEl.text().trim();
                }

                data.push({
                    name: name,
                    link: link,
                    cover: cover,
                    description: lastChapter ? "Mới nhất: " + lastChapter : "",
                    host: currentHost
                });
            }
        }

        // Handle case where page redirects to a detail page (common in search/specific slugs)
        if (data.length === 0 && doc.select(".post-title h1, .entry-title").size() > 0) {
            let name = doc.select(".post-title h1, .entry-title").first().text().trim();
            let coverEl = doc.select(".summary_image img, .post-thumbnail img").first();
            let cover = "";
            if (coverEl) {
                cover = coverEl.attr("data-src") || coverEl.attr("src") || coverEl.attr("data-original");
                if (cover && cover.indexOf("http") !== 0) {
                    if (cover.indexOf("//") === 0) cover = "https:" + cover;
                    else cover = currentHost + (cover.indexOf("/") === 0 ? "" : "/") + cover;
                }
            }
            if (name) {
                data.push({
                    name: name,
                    link: url,
                    cover: cover,
                    description: "Đang hiển thị kết quả duy nhất",
                    host: currentHost
                });
                return Response.success(data);
            }
        }

        // Improved pagination logic
        let next = "";
        let nextEl = doc.select("a.next, a[rel='next'], .nav-next a").first();
        if (nextEl) {
            next = (parseInt(page) + 1).toString();
        } else {
            // Check if there are more pages by looking at the page numbers
            let pageLinks = doc.select(".page-numbers, .pagination a");
            let maxPage = 0;
            for (let j = 0; j < pageLinks.size(); j++) {
                let text = pageLinks.get(j).text().trim();
                let num = parseInt(text);
                if (!isNaN(num) && num > maxPage) maxPage = num;
            }
            if (maxPage > parseInt(page)) {
                next = (parseInt(page) + 1).toString();
            }
        }

        return Response.success(data, next);
    }
    return null;
}
