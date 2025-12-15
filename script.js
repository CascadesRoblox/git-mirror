const converter = new showdown.Converter();
const markdownBody = document.querySelector(".markdown-body");

if (sessionStorage.getItem("README.md")) {
    fetchNav()
        .then(navContent => {
            markdownBody.innerHTML = navContent + converter.makeHtml(sessionStorage.getItem("README.md"));
            hljs.highlightAll();
        })
} else {
    fetch("https://raw.githubusercontent.com/CascadesRoblox/git-mirror/refs/heads/main/README.md")
        .then(res => res.text())
        .then(async data => {
            markdownBody.innerHTML = await fetchNav() + converter.makeHtml(data);
            hljs.highlightAll();
            sessionStorage.setItem("README.md", data);
        })
}

async function fetchNav() {
    if (sessionStorage.getItem("nav")) {
        return converter.makeHtml(sessionStorage.getItem("nav")) + "<br>";
    }

    const response = await (await fetch("/nav.md")).text();

    sessionStorage.setItem("nav", response);
    
    return converter.makeHtml(response) + "<br>";
}