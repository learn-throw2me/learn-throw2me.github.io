let pyodide;

document.addEventListener('DOMContentLoaded', async function() {
    resizeBoxes();
    showSpinner();
    pyodide = await loadPyodide();
    await pyodide.loadPackage(['numpy', 'pandas']);
    hideSpinner();
});

function showSpinner() {
    document.getElementById('spinnerContainer').style.display = 'flex';
};

function hideSpinner() {
    document.getElementById('spinnerContainer').style.display = 'none';
};

function resizeBoxes() {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const titleBar = document.querySelector('.title-bar-ide');
    const titleBarHeight = titleBar ? titleBar.offsetHeight : 10; 
                
    if (windowWidth > windowHeight) {
        const boxHeight = windowHeight - titleBarHeight;
        document.querySelector('.should-resize-this').style.height = boxHeight +'px';
        document.querySelector('.should-resize-this').style.width = windowWidth +'px';
        document.querySelector('.container').style.marginLeft = '0px';
        document.querySelector('.container').style.marginRight = '0px';
        document.querySelector('.left-box').style.height = boxHeight + 'px';
        document.querySelector('.left-box').style.overflowY = 'auto';
        document.querySelector('.right-box').style.height = boxHeight + 'px';
        document.querySelector('.right-box').style.overflowY = 'auto';
        document.querySelector('.left-buttons-holder').style.marginRight = '9%';
        document.querySelector('.right-buttons-holder').style.marginLeft = '9%';

        var totalHeight = [...document.querySelectorAll('.right-buttons-holder, .prg-input')]
        .reduce((sum, div) => {
        const style = getComputedStyle(div);
        const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        const height = div.offsetHeight + margin;
        return sum + height;
        }, 0);
        totalHeight += titleBarHeight;

        document.querySelector('.prg-editor').style.height = windowHeight - totalHeight -14 + 'px';

    } 
    else {
        document.querySelector('.prg-editor').style.height = windowHeight*0.65 + 'px';
        document.querySelector('.right-box').style.paddingBottom = '25px';
    }
};

document.querySelector('.run-the-code').addEventListener('click', async function() {
    showSpinner();
    editor.setOption("showGutter", true);
    const inputValues = document.querySelector('.program-input').value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const code = editor.getValue().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const output = await pyodide.runPythonAsync(`
import sys
import warnings
from io import StringIO
warnings.filterwarnings("ignore", category=DeprecationWarning)
input_stream = StringIO("""${inputValues}""")
sys.stdin = input_stream
output_stream = StringIO()
sys.stdout = output_stream
error_stream = StringIO()
sys.stderr = error_stream

try:
    exec('''${code}''')
except Exception as e:
    print(e, file=sys.stderr)

sys.stdin = sys.__stdin__
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

(output_stream.getvalue(), error_stream.getvalue())
`);
    let [result, error] = output;
    let prgOutput = result + (error || '');
    prgOutput = prgOutput || "No output? Check the program again.";
    prgOutput = 'Output: \n' + prgOutput;
    document.querySelector('.prg-output').innerHTML = `<pre style='padding-bottom:2px;padding-left:5px'>${prgOutput}</pre>`;
    hideSpinner();
    window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
    });
    smoothScrollToBottom('right-box');
});

function smoothScrollToBottom(className) {
    const scrollableDiv = document.querySelector(`.${className}`);
    if (scrollableDiv) {
        scrollableDiv.scroll({
            top: scrollableDiv.scrollHeight,
            behavior: 'smooth'
        });
    }
};
