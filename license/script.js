const markdownBody = document.querySelector(".markdown-body");

if (sessionStorage.getItem("LICENSE")) {
    fetchNav()
        .then(navContent => {
            markdownBody.innerHTML = navContent + sessionStorage.getItem("LICENSE");
        })
} else {
    fetch("https://raw.githubusercontent.com/CascadesRoblox/git-mirror/refs/heads/main/LICENSE")
        .then(res => res.text())
        .then(async data => {
            markdownBody.innerHTML = await fetchNav() + data;
            sessionStorage.setItem("LICENSE", data);
        })
}

async function fetchNav() {
    const converter = new showdown.Converter();

    if (sessionStorage.getItem("nav")) {
        return converter.makeHtml(sessionStorage.getItem("nav")) + "<br>";
    }

    const response = await (await fetch("../nav.md")).text();

    sessionStorage.setItem("nav", response);

    return converter.makeHtml(response) + "<br>";
}