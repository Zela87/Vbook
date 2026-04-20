load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        // Selector chính xác theo dữ liệu mới: div.prose.max-w-none
        let contentEl = doc.select("div.prose.max-w-none").first();
        
        if (contentEl) {
            // Xóa bỏ các thành phần rác nếu có bên trong nội dung
            contentEl.select("script, style, ins, .ads-responsive").remove();
            
            // Xóa đoạn văn bản bản quyền/quảng cáo ở cuối nội dung (nếu có)
            contentEl.select("p").forEach(function(el) {
                let text = el.text().toLowerCase();
                if (text.indexOf("khotruyenchu.me") >= 0 || text.indexOf("sưu tầm từ các nguồn") >= 0) {
                    el.remove();
                }
            });

            let html = contentEl.html();
            return Response.success(cleanContent(html));
        }
    }
    return null;
}

function cleanContent(html) {
    if (!html) return "";
    
    return html
        .replace(/<p[^>]*>/gi, "")
        .replace(/<\/p>/gi, "<br><br>")
        .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "<br><br>") // Tránh lặp quá nhiều dòng trống
        .replace(/&nbsp;/g, " ")
        .replace(/Truyện được sưu tầm từ các nguồn diễn đàn.*/gi, "")
        .trim();
}