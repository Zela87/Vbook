// Hàm chính để lấy danh sách các danh mục trên trang chủ
function execute() {
    // Trả về danh sách các danh mục truyện trên trang chủ
    return Response.success([
        // Danh mục truyện mới cập nhật
        {title: "Mới Cập Nhật", input: "/tim-kiem?sort=-updated_at&filter%5Bstatus%5D=2,1", script: "gen.js"},
        // Danh mục truyện top trong ngày
        {title: "Top Ngày", input: "/tim-kiem?sort=-views_day&filter%5Bstatus%5D=2,1", script: "gen.js"},
        // Danh mục truyện top trong tuần
        {title: "Top Tuần", input: "/tim-kiem?sort=-views_week&filter%5Bstatus%5D=2,1", script: "gen.js"},
        // Danh mục truyện top trong tháng
        {title: "Xem Nhiều", input: "/tim-kiem?sort=-views&filter%5Bstatus%5D=2,1", script: "gen.js"},
        // Danh mục truyện được yêu thích
        {title: "Mới Nhất", input: "/tim-kiem?sort=-created_at&filter%5Bstatus%5D=2,1", script: "gen.js"},
        // Danh mục truyện mới
        {title: "Cũ Nhất", input: "/tim-kiem?sort=created_at&filter%5Bstatus%5D=2,1", script: "gen.js"}
    ]);
}
