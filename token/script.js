const nav = document.querySelector("nav");
const create = document.getElementById("create");
const tokenText = document.getElementById("token");
const options = document.getElementById("options");
const copy = document.getElementById("copy");
const env = document.getElementById("env");
const envContainer = document.getElementById("envContainer");
const converter = new showdown.Converter();
let token = "";

fetchNav().then(data => nav.innerHTML = data);

create.addEventListener("click", () => {
    const tokenWindow = open("https://github.com/settings/tokens/new", "", openOptions({
        popup: true,
        width: screen.width / 1.5,
        height: screen.height,
        top: 0,
        left: 0,
    }))
    const promptWindow = open("./prompt.html", "", openOptions({
        popup: true,
        width: screen.width / 3,
        height: screen.height,
        top: 0,
        left: screen.width / 1.5,
    }))

    if (!tokenWindow || !promptWindow) {
        if (tokenWindow) tokenWindow.close();
        if (promptWindow) promptWindow.close();

        return alert("Please allow popups for this site.");
    }

    promptWindow.addEventListener("message", e => {
        promptWindow.close();

        if (e.data == "close") {
            tokenWindow.close();
        } else {
            token = e.data;
            tokenText.innerHTML = `<b>Token:</b> ${token}`;
            options.style.display = "block";
        }
    })

    addEventListener("beforeunload", () => {
        tokenWindow.close();
        promptWindow.close();
    })

    const interval = setInterval(() => {
        if (tokenWindow.closed) {
            clearInterval(interval);
            promptWindow.close();
        }
    }, 500)
})

copy.addEventListener("click", () => {
    navigator.clipboard.writeText(token).then(() => {
        const old = copy.innerHTML;

        copy.innerHTML = `Copied! <span class="material-symbols-outlined">check</span>`;
        setTimeout(() => {
            copy.innerHTML = old;
        }, 3000)
    }).catch(() => {
        const old = copy.innerHTML;

        copy.innerHTML = `Failed to copy! <span class="material-symbols-outlined">error</span>`;
        setTimeout(() => {
            copy.innerHTML = old;
        }, 3000)
    })
})

env.addEventListener("click", () => {
    if (!token) return alert("No token to convert!");

    envContainer.textContent = `TOKEN=${token}`;
    delete envContainer.dataset.highlighted;
    hljs.highlightElement(envContainer);
})

function openOptions(options) {
    return JSON.stringify(options).replaceAll('"', "").replaceAll(":", "=").replaceAll("{", "").replaceAll("}", "")
}

async function fetchNav() {
    if (sessionStorage.getItem("nav")) {
        return converter.makeHtml(sessionStorage.getItem("nav")) + "<br>";
    }

    const response = await (await fetch("../nav.md")).text();

    sessionStorage.setItem("nav", response);
    
    return converter.makeHtml(response) + "<br>";
}