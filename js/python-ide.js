let editor;
let pyodide;

document.addEventListener('DOMContentLoaded', async function() {
    prepareEditor();
    resizeBoxes();
    showSpinner();
    pyodide = await loadPyodide();
    await pyodide.loadPackage(['numpy', 'pandas']);
    hideSpinner();
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
    editor.session.setMode("ace/mode/python");
    editor.resize(true);
    editor.setOptions({
            fontSize: "15px",
            highlightActiveLine: false,
            showGutter: false
        });
    editor.setValue('', 1);
    editor.container.style.lineHeight = 1.5;
    editor.insert("# Start coding in Python here\n");
}

function resizeBoxes() {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const titleBar = document.querySelector('.title-bar-ide');
    const titleBarHeight = titleBar ? titleBar.offsetHeight : 10; 
                
    if (windowWidth > windowHeight) {
        const boxHeight = windowHeight - titleBarHeight;
        document.querySelector('.should-resize-this').style.cssText = `height: ${boxHeight}px; width: ${windowWidth}px;`;
        document.querySelector('.container').style.cssText = 'margin-left: 0px; margin-right: 0px;';
        document.querySelector('.left-box').style.cssText = `height: ${boxHeight}px; overflow-y: auto;`;
        document.querySelector('.right-box').style.cssText = `height: ${boxHeight}px; overflow-y: auto;`;
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
        document.querySelector('.prg-editor').style.height = windowWidth*1.3 + 'px';
        document.querySelector('.right-box').style.paddingBottom = '25px';
    }
}

document.querySelector('.run-the-code').addEventListener('click', async function() {
    showSpinner();
    editor.setOption("showGutter", true);
    const inputValues = document.querySelector('.program-input').value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
    const code = editor.getValue().replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
    const output = await pyodide.runPythonAsync(`
globals().clear()
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
    prgOutput = prgOutput || "No output? Check the program again. \n";
    prgOutput = 'Output: \n' + prgOutput;
    prgOutput += '\n*Feedback, collab or anything else? \n<i class="fas fa-envelope" style="color: white;"></i> <a href="mailto:hi@throw2me.com" style="color: lightblue;text-decoration: none">hi@throw2me.com</a> | <i class="fab fa-facebook" style="color: white;"></i> <a href="https://www.facebook.com/profile.php?id=61563347068813" style="color: lightblue; text-decoration: none;">Like please!</a>'
    document.querySelector('.prg-output').innerHTML = `<pre style='padding-bottom:2px;padding-left:5px'>${prgOutput}</pre>`;
    hideSpinner();
    window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
    });
    smoothScrollToBottom('right-box');
});

document.querySelector('.clear-the-code').addEventListener('click', function() {
    document.querySelector('.prg-output').innerHTML = '';
    editor.setOption("showGutter", false);
    editor.setValue('', 1);
    editor.insert("# Start coding in Python here\n");
    document.querySelector('.program-input').value = '';
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
