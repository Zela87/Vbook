load("config.js");
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL , script: "gen.js" },
        { title: "Sayhentai", input: BASE_URL + "/hentaiz/sayhentai/", script: "gen.js" },
        { title: "LXMANGA", input: BASE_URL + "/hentaiz/hentai-lxmanga/", script: "gen.js" },
        { title: "Không che", input: BASE_URL + "/hentaiz/truyen-hentai-khong-che/", script: "gen.js" }
    ]);
}