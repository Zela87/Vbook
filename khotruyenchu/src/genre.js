load('config.js');


function execute() {
    var list = [
        {title: "Top xếp hạng Qidian", input: "/top-qidian", script: "gen.js"},
        {title: "Huyền huyễn – Tiên hiệp", input: "/huyen-huyen-tien-hiep", script: "gen.js"},
        {title: "Độc giả yêu cầu dịch", input: "/yeu-cau-dich", script: "gen.js"},
        {title: "Đô thị", input: "/do-thi", script: "gen.js"},
        {title: "Hệ thống", input: "/he-thong", script: "gen.js"},
        {title: "Khoa học viễn tưởng", input: "/khoa-hoc-vien-tuong", script: "gen.js"},
    ];
    return Response.success(list);
}