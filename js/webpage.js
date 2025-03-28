let editor;

document.addEventListener('DOMContentLoaded', async function() {
    prepareEditor();
    resizeBoxes();
    loadCode();
});

function prepareEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.session.setMode("ace/mode/html");
    editor.resize(true);
    editor.setOptions({
        fontSize: "15px",
        highlightActiveLine: false,
        printMargin: false,
        showGutter: false
    });
    editor.setValue('', 1);
    editor.container.style.lineHeight = 1.5;
    editor.insert(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Learn - Throw 2 Me</title>
</head>
<body>

</body>
</html>
`);
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

    var totalHeight = [...document.querySelectorAll('.right-buttons-holder')]
    .reduce((sum, div) => {
        const style = getComputedStyle(div);
        const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        const height = div.offsetHeight + margin;
        return sum + height;
        }, 0);
    totalHeight += titleBarHeight;

    document.querySelector('.prg-editor').style.height = windowHeight - totalHeight -8 + 'px';
}

document.querySelector('.run-the-code').addEventListener('click', async function() {
    const htmlCode = editor.getValue();
    document.querySelector('.prg-output').style.cssText += 'border-left: 1px solid lightgrey; border-bottom: 1px solid lightgrey; border-right: 1px solid lightgrey;';
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = `${window.innerWidth}px`;
    iframe.style.border = 'none';
    iframe.style.marginBottom = '-8px';
    iframe.srcdoc = htmlCode;
    document.querySelector('.prg-output').innerHTML = '';
    document.querySelector('.prg-output').appendChild(iframe);
    document.querySelector('.right-content').style.paddingBottom = '7px';
    window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
    });
    smoothScrollToBottom('right-box');
});

document.querySelector('.clear-the-code').addEventListener('click', function() {
    document.querySelector('.prg-output').innerHTML = '';
    document.querySelector('.prg-output').style.cssText += 'border-left: none; border-bottom: none; border-right: none;';
    editor.setValue('', 1);
    editor.insert(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Learn - Throw 2 Me</title>
</head>
<body>

</body>
</html>
`);
document.querySelector('.right-content').style.paddingBottom = '6px';
});

document.querySelector('.reload-the-code').addEventListener('click', async function() {
    location.reload();
});

function smoothScrollToBottom(className) {
    const scrollableDiv = document.querySelector(`.${className}`);
    if (scrollableDiv) {
        scrollableDiv.scroll({
            top: scrollableDiv.scrollHeight,
            behavior: 'smooth'
        });
    }
}
