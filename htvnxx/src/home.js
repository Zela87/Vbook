load("config.js");

function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/truyen-hentai/", script: "gen.js" },
        { title: "Trending", input: "/truyen-hentai/?m_orderby=trending", script: "gen.js" },
        { title: "Xếp hạng", input: "/truyen-hentai/?m_orderby=rating", script: "gen.js" },
        { title: "Xem nhiều", input: "/truyen-hentai/?m_orderby=views", script: "gen.js" },
        { title: "Truyện mới", input: "/truyen-hentai/?m_orderby=new-manga", script: "gen.js" }
    ]);
}