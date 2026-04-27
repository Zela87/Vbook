load("config.js");

function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/truyen-hentai/", script: "gen.js" },
        { title: "Trending", input: BASE_URL + "/truyen-hentai/?m_orderby=trending", script: "gen.js" },
        { title: "Xếp hạng", input: BASE_URL + "/truyen-hentai/?m_orderby=rating", script: "gen.js" },
        { title: "Xem nhiều", input: BASE_URL + "/truyen-hentai/?m_orderby=views", script: "gen.js" },
        { title: "Truyện mới", input: BASE_URL + "/truyen-hentai/?m_orderby=new-manga", script: "gen.js" }
    ]);
}