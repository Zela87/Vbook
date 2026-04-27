load('config.js');
function execute() {
    return Response.success([
        {title: "Trending", input: "/?m_orderby=trending", script: "gen.js"},
        {title: "Xếp Hạng", input: "/?m_orderby=rating", script: "gen.js"},
        {title: "Xem Nhiều", input: "//?m_orderby=views", script: "gen.js"}
    ]);
}
