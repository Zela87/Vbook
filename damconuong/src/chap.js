let BASE_URL = 'https://damconuong.plus';
try { if (CONFIG_URL) BASE_URL = CONFIG_URL; } catch (e) {}

function bypass(url, doc) {
    // Nhiều trang có cơ chế anti-bot: ban đầu trả HTML chứa script set document.cookie
    // Nếu phát hiện cookie đó, gọi lại HTTP với header Cookie để qua bước kiểm tra.
    var cookie = doc.html().match(/document.cookie="(.*?)"/);
    if (cookie) {
        cookie = cookie[1];
        doc = Http.get(url).headers({"Cookie": cookie}).html();
    }
    return doc;
}

function execute(url) {
    // Nếu url là tương đối thì nối với BASE_URL
    url = url.indexOf('http') === 0 ? url : BASE_URL + url;

    // Lấy HTML và chạy bypass (nếu cần cookie)
    var doc = bypass(url, Http.get(url).html());

    if (!doc) return Response.error("Không tải được dữ liệu");

    // Chọn thẻ <img> hiển thị nội dung chương truyện
    var imgs = doc.select("#chapter-content img.chapter-img");
    var data = [];

    for (var i = 0; i < imgs.size(); i++) {
        var e = imgs.get(i);
        // dùng data-src trước (lazy load), nếu không có thì dùng src
        var link = e.attr("data-src").trim();
        if (!link) link = e.attr("src").trim();

        // bỏ ảnh inline base64
        if (link && !link.startsWith("data:")) {
            data.push({
                link: link,
                Referer: BASE_URL,
            });
        }
    }

    return Response.success(data);
}