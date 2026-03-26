function execute() {
    return Response.success([
        {title: "Top xếp hạng Qidian", input: "https://khotruyenchu.sbs/top-qidian", script: "gen.js"},
        {title: "Huyền huyễn – Tiên hiệp", input: "https://khotruyenchu.sbs/huyen-huyen-tien-hiep", script: "gen.js"},
        {title: "Độc giả yêu cầu dịch", input: "https://khotruyenchu.sbs/yeu-cau-dich", script: "gen.js"},
        {title: "Đô thị", input: "https://khotruyenchu.sbs/do-thi", script: "gen.js"},
        {title: "Hệ thống", input: "https://khotruyenchu.sbs/he-thong", script: "gen.js"},
        {title: "Khoa học viễn tưởng", input: "https://khotruyenchu.sbs/khoa-hoc-vien-tuong", script: "gen.js"},
    ]);
}