// Hàm chính để lấy danh sách các danh mục trên trang chủ
function execute() {
    // Trả về danh sách các danh mục truyện trên trang chủ
    return Response.success([
        // Danh mục truyện mới cập nhật
        {title: "Top xếp hạng Qidian", input: "/top-qidian", script: "gen.js"},
        // Danh mục truyện top trong ngày
        {title: "Huyền huyễn – Tiên hiệp", input: "/huyen-huyen-tien-hiep", script: "gen.js"},
        // Danh mục truyện top trong tuần
        {title: "Độc giả yêu cầu dịch", input: "/yeu-cau-dich", script: "gen.js"},
        // Danh mục truyện top trong tháng
        {title: "Đô thị", input: "/do-thi", script: "gen.js"},
        // Danh mục truyện được yêu thích
        {title: "Hệ thống", input: "/he-thong", script: "gen.js"},
        // Danh mục truyện mới
        {title: "Khoa học viễn tưởng", input: "/khoa-hoc-vien-tuong", script: "gen.js"}
    ]);
}
