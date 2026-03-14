function execute(url) {
    // 1. Lấy AID từ đường dẫn
    var aidMatch = url.match(/aid-(\d+)/);
    if (!aidMatch) return null;
    var aid = aidMatch[1];
    
    // 2. Gọi file dữ liệu JSON mà bro đã soi được (Rất ổn định trên PC)
    var itemUrl = "https://wnacg.com/photos-item-aid-" + aid + ".html";
    var response = fetch(itemUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://wnacg.com/photos-slide-aid-" + aid + ".html"
        }
    });

    if (response.ok) {
        var text = response.text();
        var images = [];
        // Regex bóc tách link, dọn sạch dấu gạch chéo ngược
        var regex = /"(?:\/\/|https?:\/\/)([^"]+?\.(?:jpg|jpeg|png|webp|gif))/gi;
        var match;

        while ((match = regex.exec(text)) !== null) {
            var imgPath = match[1].replace(/\\/g, "");
            
            // ÉP BUỘC dùng HTTPS và Referer tối giản nhất
            // Một số máy chủ ảnh sẽ chặn nếu Referer quá dài hoặc chứa ký tự đặc biệt
            var secureImg = "https://" + imgPath.replace(/^https?:\/\//i, "").replace(/^\/\//, "");
            
            if (images.indexOf(secureImg) === -1) {
                // Thử dùng trang chủ làm Referer - đôi khi đây là cách vượt rào tốt nhất trên mobile
                images.push(secureImg);
            }
        }
        
        if (images.length > 0) return Response.success(images);
    }
    return null;
}