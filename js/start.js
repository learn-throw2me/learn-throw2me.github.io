function restart() {
    window.location.replace('index.html?t=' + new Date().getTime());
}

function showUpdateAlertModal() {
        document.querySelector('.update-alert').classList.add('show');
        document.querySelector('.update-alert').style.display = 'block';
        document.querySelector('.update-alert').setAttribute('aria-hidden', 'false');
        document.querySelector('.update-alert').setAttribute('aria-modal', 'true');
        document.querySelector('.modal-backdrop').style.display = 'block';
    }

    function hideUpdateAlertModal() {
        document.querySelector('.update-alert').classList.remove('show');
        document.querySelector('.update-alert').style.display = 'none';
        document.querySelector('.update-alert').setAttribute('aria-hidden', 'true');
        document.querySelector('.update-alert').setAttribute('aria-modal', 'false');
        document.querySelector('.modal-backdrop').style.display = 'none';
    }

    function setUpdateAlertText(text1, text2) {
        document.querySelector('.update-alert .update-alert-text').innerText = text1;
        if (text2 != null)
        document.querySelector('.update-alert .update-alert-text2').innerText = text2;
    }

    function setUpdateAlertLink(url) {
        document.querySelector('.update-alert .update-alert-link').setAttribute('href', url);
    }
