function restart() {
    window.location.replace('/index.html?t=' + new Date().getTime());
}

function showUpdateAlertModal() {
    document.querySelector('.update-alert').classList.add('show');
    document.querySelector('.update-alert').style.display = 'block';
    document.querySelector('.update-alert').setAttribute('aria-hidden', 'false');
    document.querySelector('.update-alert').setAttribute('aria-modal', 'true');
}

function hideUpdateAlertModal() {
    document.querySelector('.update-alert').classList.remove('show');
    document.querySelector('.update-alert').style.display = 'none';
    document.querySelector('.update-alert').setAttribute('aria-hidden', 'true');
    document.querySelector('.update-alert').setAttribute('aria-modal', 'false');
}

function setUpdateAlertText(text1, text2) {
    document.querySelector('.update-alert .update-alert-text').innerText = text1;
    if (text2 != null)
    document.querySelector('.update-alert .update-alert-text2').innerText = text2;
}

function setUpdateAlertLink(url) {
    document.querySelector('.update-alert .update-alert-link').setAttribute('href', url);
}

document.addEventListener('DOMContentLoaded', async function() {
    const hash = window.location.hash;
    const paramValue = hash.slice(1);
    let folder = null;
    let contentIndex = null;
    let fetchRoute = null;

    if (paramValue) {
        const firstTwoChars = paramValue.slice(0, 2);
        switch (firstTwoChars) {
            case "cc":
            folder = "c";
            break;
            case "cp":
            folder = "cpp";
            break;
            case "ja":
            folder = "java";
            break;
            case "da":
            folder = "dsa";
            break;
            case "db":
            folder = "dbsql";
            break;
            case "we":
            folder = "web";
            break;
            case "py":
            folder = "python";
            break;
            default:
            folder = null;
        }

        if (folder) {
            const contentIndexValue = paramValue.slice(2);
            contentIndex = parseInt(contentIndexValue, 10);
            if (isNaN(contentIndex)) {
            contentIndex = null;
            }
            if (contentIndex !== null) {
            fetchRoute = `/${folder}/${contentIndex}.html`;

            fetch(fetchRoute)
                .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Failed to load content');
                })
                .then(htmlContent => {
                    const mainContentDiv = document.querySelector('.main-content');
                    if (mainContentDiv) {
                        mainContentDiv.innerHTML = htmlContent;
                    }
                })
            }
        }
    }
});