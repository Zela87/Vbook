load('config.js');

function execute() {
    return Response.success([
        { title: "Truyện Mới Cập Nhật", input: BASE_URL + "/danh-sach/truyen-tien-hiep-hay/", script: "gen.js" },
        { title: "Truyện Hot", input: BASE_URL + "/danh-sach/truyen-hot/", script: "gen.js" },
        { title: "Truyện Full", input: BASE_URL + "/danh-sach/truyen-full/", script: "gen.js" }
    ]);
}
