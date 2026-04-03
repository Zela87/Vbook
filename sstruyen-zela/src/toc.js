load('config.js');
/**
 * Hàm execute - Lấy danh sách các chương từ URL được cung cấp
 * @param {string} url
 * @returns {Response}
 */
function execute(url) {

    let response = fetch(url);

    if (!response.ok) return null;

    let doc = response.html();
    let chapters = [];

    // Lấy list chương
    let items = doc.select("li a[href*='/chuong-'], li a[href*='/chuong/']");

    // fallback nếu không có
    if (items.isEmpty()) {
        items = doc.select(".list-chuong a, .entry-content a[href*='/chuong-'], article a[href*='/chuong-']");
    }

    let seenUrls = {};

    for (let i = 0; i < items.size(); i++) {
        let item = items.get(i);

        let name = item.text().trim();
        let href = item.attr("href");

        if (
            name &&
            href &&
            (href.includes('/chuong-') || href.includes('/chuong/')) &&
            !href.includes('#')
        ) {
            let cleanUrl = href.split('?')[0].split('#')[0];

            if (cleanUrl.endsWith('/')) {
                cleanUrl = cleanUrl.slice(0, -1);
            }

            if (!seenUrls[cleanUrl]) {
                seenUrls[cleanUrl] = true;

                let cleanName = name
                    .replace(/\s+/g, ' ')
                    .replace(/^(Chương\s+\d+)\s*[:\-\s]\s*/i, "$1: ")
                    .trim();

                chapters.push({
                    name: cleanName,
                    url: cleanUrl + "/",
                    host: BASE_URL
                });
            }
        }
    }

    // =========================
    // ✅ PHẦN XỬ LÝ NEXT PAGE
    // =========================
    let next = "";

    let nextEl = doc.select("div.paging a:has(span:contains(›))").first();

    if (nextEl) {
        let onclickAttr = nextEl.attr("onclick"); // page(67390,3)

        if (onclickAttr && onclickAttr.includes("page(")) {
            let match = onclickAttr.match(/page\((\d+),\s*(\d+)\)/);

            if (match) {
                let key = match[1];
                let nextPage = match[2];

                next = BASE_URL + "/get/listchap/" + key + "?page=" + nextPage;
            }
        }
    }

    // =========================
    // ✅ RETURN KẾT QUẢ
    // =========================
    return Response.success(chapters, next);
}