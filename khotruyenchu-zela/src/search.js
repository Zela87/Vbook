load('config.js');

function execute(key, page) {
    if (!page) page = '1';

    let response = fetch(BASE_URL + "/tim-kiem", {
        method: "GET",
        queries: {
            tukhoa: key,
            page: page
        }
    });

    if (!response.ok) return null;
    let doc = response.html();

    // =============================================================
    // CASE 1: Nếu server nhảy thẳng vào trang chi tiết (Redirect)
    // =============================================================
    let h1Text = doc.select("h1").text();
    // Kiểm tra nếu h1 là tên truyện và không phải là tiêu đề "Kết quả tìm kiếm"
    if (h1Text && !h1Text.includes("Kết quả tìm kiếm") && response.url.includes("/truyen/")) {
        let coverEl = doc.select("img.object-cover").first();
        let author = "";
        
        // Tìm text "Tác giả:" trong các div
        doc.select("div").forEach(div => {
            if (div.text().includes("Tác giả:")) {
                author = div.text().replace("Tác giả:", "").trim();
            }
        });

        return Response.success([{
            name: h1Text.trim(),
            link: response.url,
            cover: coverEl ? coverEl.attr("src") : "",
            description: author,
            host: BASE_URL
        }]);
    }

    // =============================================================
    // CASE 2: Danh sách kết quả tìm kiếm (Dựa trên HTML bạn gửi)
    // =============================================================
    let novelList = [];
    // Selector lấy các item truyện trong danh sách
    let items = doc.select("div.flex.gap-4.py-1.border-b");

    items.forEach(item => {
        let titleEl = item.select("a.font-semibold").first();
        let coverEl = item.select("img").first();
        
        // Lấy Tác giả và Trạng thái từ các thẻ div con
        let author = "";
        let status = "";
        item.select("div.text-sm").forEach(div => {
            let txt = div.text();
            if (txt.includes("Tác giả:")) author = txt.replace("Tác giả:", "").trim();
            if (txt.includes("Trạng thái:")) status = txt.replace("Trạng thái:", "").trim();
        });

        // Lấy chương mới nhất (nếu có) ở cột bên phải
        let lastChap = item.select("div.whitespace-nowrap a").text().trim();

        if (titleEl) {
            let name = titleEl.text().trim();
            let link = titleEl.attr("href");

            novelList.push({
                name: name,
                link: link.startsWith("http") ? link : BASE_URL + link,
                cover: coverEl ? coverEl.attr("src") : "",
                description: author + (status ? " [" + status + "]" : "") + (lastChap ? " - " + lastChap : ""),
                host: BASE_URL
            });
        }
    });

    return Response.success(novelList);
}