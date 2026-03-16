// Định nghĩa URL cơ sở của trang web truyện
let BASE_URL = 'https://damconuong.plus';

// Thử lấy URL cấu hình từ CONFIG_URL nếu có
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua lỗi nếu CONFIG_URL không tồn tại
}

// Hàm bypass để xử lý cookie từ trang web
function bypass(url, doc) {
    // Tìm cookie trong HTML của trang
    var cookie = doc.html().match(/document.cookie="(.*?)"/);
    if (cookie) {
        // Lấy giá trị cookie từ kết quả match
        cookie = cookie[1];
        // Gửi lại request với cookie để bypass
        doc = Http.get(url).headers({"Cookie": cookie}).html();
        // Ghi log cookie và nội dung HTML để debug
        Console.log(cookie);
        Console.log(doc);
    }
    // Trả về document đã xử lý
    return doc
}