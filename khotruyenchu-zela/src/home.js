load('config.js');

function execute() {
    return Response.success([
        { title: "Hài Hước", input: BASE_URL + "/the-loai/hai-huoc", script: "gen.js" },
        { title: "Hệ Thống", input: BASE_URL + "/the-loai/he-thong", script: "gen.js" },
        { title: "Kiếm Hiệp", input: BASE_URL + "/the-loai/kiem-hiep", script: "gen.js" },
        { title: "Tiên Hiệp", input: BASE_URL + "/the-loai/tien-hiep", script: "gen.js" },
        { title: "Trinh Thám", input: BASE_URL + "/the-loai/trinh-tham", script: "gen.js" },
        { title: "Trọng Sinh", input: BASE_URL + "/the-loai/trong-sinh", script: "gen.js" },
        { title: "Xuyên Không", input: BASE_URL + "/the-loai/xuyen-khong", script: "gen.js" },
        { title: "Xuyên Nhanh", input: BASE_URL + "/the-loai/xuyen-nhanh", script: "gen.js" }
    ]);
}