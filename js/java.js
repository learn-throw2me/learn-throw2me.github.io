let editor;

document.addEventListener('DOMContentLoaded', async function() {
    prepareEditor();
    resizeBoxes();
});

function showSpinner() {
    document.getElementById('spinnerContainer').style.display = 'flex';
}

function hideSpinner() {
    document.getElementById('spinnerContainer').style.display = 'none';
}

function showLineNum() {
    editor.setOption("showGutter", true);
}

function hideLineNum() {
    editor.setOption("showGutter", false);
}

function prepareEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.session.setMode("ace/mode/java");
    editor.resize(true);
    editor.setOptions({
        fontSize: "15px",
        highlightActiveLine: false,
        printMargin: false,
        showGutter: false
    });
    editor.setValue('', 1);
    editor.container.style.lineHeight = 1.5;
    editor.insert(`public class Main {
    public static void main(String[] args) {
        
    }
}`);
}

function resizeBoxes() {
    const windowHeight = window.innerHeight - 80;
    const windowWidth = window.innerWidth;
    const titleBar = document.querySelector('.title-bar-ide');
    const titleBarHeight = titleBar ? titleBar.offsetHeight : 0; 
                
    const boxHeight = windowHeight - titleBarHeight;
    document.querySelector('.should-resize-this').style.cssText = `height: ${boxHeight}px; width: ${windowWidth}px;`;
    document.querySelector('.container').style.cssText = 'margin-left: 0px; margin-right: 0px;';
    document.querySelector('.right-box').style.cssText = `height: ${boxHeight}px; overflow-y: auto;`;

    var totalHeight = [...document.querySelectorAll('.right-buttons-holder, .prg-input')]
    .reduce((sum, div) => {
        const style = getComputedStyle(div);
        const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        const height = div.offsetHeight + margin;
        return sum + height;
        }, 0);
    totalHeight += titleBarHeight;

    document.querySelector('.prg-editor').style.height = windowHeight - totalHeight -8 + 'px';
}

document.querySelector('.clear-the-code').addEventListener('click', function() {
    document.querySelector('.prg-output').innerHTML = '';
    editor.setOption("showGutter", false);
    editor.setValue('', 1);
    editor.insert(`public class Main {
    public static void main(String[] args) {
        
    }
}`);
    document.querySelector('.program-input').value = '';
});

document.querySelector('.reload-the-code').addEventListener('click', async function() {
    location.reload();
});

function goToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
    smoothScrollToBottom('right-box');
}

function smoothScrollToBottom(className) {
    const scrollableDiv = document.querySelector(`.${className}`);
    if (scrollableDiv) {
        scrollableDiv.scroll({
            top: scrollableDiv.scrollHeight,
            behavior: 'smooth'
        });
    }
}
