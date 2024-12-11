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

function prepareEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.session.setMode("ace/mode/sql");
    editor.resize(true);
    editor.setOptions({
        fontSize: "15px",
        highlightActiveLine: false,
        printMargin: false,
        showGutter: false
    });
    editor.setValue('', 1);
    editor.container.style.lineHeight = 1.5;
    editor.insert("--Queries\n");
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

document.querySelector('.clear-the-code').addEventListener('click', function() {
    document.querySelector('.prg-output').innerHTML = '';
    editor.setOption("showGutter", false);
    editor.setValue('', 1);
    editor.insert("--Queries\n");
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

var worker = new Worker('cdn/sqljs/worker.sql-wasm.js');

worker.postMessage({ action: 'open' });

document.querySelector('.run-the-code').addEventListener('click', async function() {
    document.querySelector('.prg-output').innerHTML = `<pre class='console-output-here' style='padding-bottom:2px;padding-left:5px;margin-bottom:0px'></pre>`;
    showSpinner();
    editor.setOption("showGutter", false);
    var sqlQuery = editor.getValue();
    worker.onmessage = function (event) {
        hideSpinner();
        let consoleElement = document.querySelector('.console-output-here');
        var results = event.data.results;
        if (results) {
            let lastResult = '';
            if (Array.isArray(results)) {
                results.forEach(result => {
                    if (result && result.values && result.values.length > 0) {
                        let columnWidths = result.columns.map((column, i) => {
                            let maxLength = column.length;
                            result.values.forEach(row => {
                                maxLength = Math.max(maxLength, row[i] ? row[i].toString().length : 0);
                            });
                            return maxLength;
                        });
                        let formattedResults = '';
                        result.columns.forEach((column, i) => {
                            formattedResults += column.padEnd(columnWidths[i], ' ') + ' | ';
                        });
                        formattedResults = formattedResults.trimEnd() + '\n';
                        result.values.forEach(row => {
                            row.forEach((value, i) => {
                                formattedResults += (value === null ? '' : value.toString()).padEnd(columnWidths[i], ' ') + ' | ';
                            });
                            formattedResults = formattedResults.trimEnd() + '\n';
                        });
                        lastResult += `${formattedResults}\n`;
                    } else {
                        lastResult += `No output? Check queries.`;
                    }
                });
            } else {
                if (results.values && results.values.length > 0) {
                    let columnWidths = results.columns.map((column, index) => {
                        let maxLength = column.length;
                        results.values.forEach(row => {
                            maxLength = Math.max(maxLength, row[index] ? row[index].toString().length : 0);
                        });
                        return maxLength;
                    });
                    let formattedResults = '';
                    results.columns.forEach((column, index) => {
                        formattedResults += column.padEnd(columnWidths[index], ' ') + ' | ';
                    });
                    formattedResults = formattedResults.trimEnd() + '\n';
                    results.values.forEach(row => {
                        row.forEach((value, index) => {
                            formattedResults += (value === null ? '' : value.toString()).padEnd(columnWidths[index], ' ') + ' | ';
                        });
                        formattedResults = formattedResults.trimEnd() + '\n';
                    });
                    lastResult += `${formattedResults}\n`;
                } else {
                    lastResult += `No output? Check queries.`;
                }
            }
            consoleElement.innerHTML += lastResult.trimEnd() + '\n';
        } else if (event.data.error) {
            editor.setOption("showGutter", true);
            consoleElement.innerHTML += `Error: ${event.data.error}\n`;
        }
        if (!consoleElement.innerHTML.trim()) {
            consoleElement.innerHTML = 'No output? Check queries.';
            editor.setOption("showGutter", true);
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        smoothScrollToBottom('right-box');
    }
    worker.postMessage({ action: 'exec', sql: sqlQuery });
});
