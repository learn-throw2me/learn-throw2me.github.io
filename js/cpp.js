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
    editor.session.setMode("ace/mode/c_cpp");
    editor.resize(true);
    editor.setOptions({
        fontSize: "15px",
        highlightActiveLine: false,
        printMargin: false,
        showGutter: false
    });
    editor.setValue('', 1);
    editor.container.style.lineHeight = 1.5;
    editor.insert("//Code\n");
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
    editor.insert("//Code\n");
    document.querySelector('.program-input').value = '';
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

class WorkerAPI {
    constructor() {
        this.worker = new Worker('cdn/cppwasm/worker.js');
        const channel = new MessageChannel();
        this.port = channel.port1;
        this.port.onmessage = this.onmessage.bind(this);
        const remotePort = channel.port2;
        this.worker.postMessage({ id: 'constructor', data: remotePort }, [remotePort]);
    }

    compileLinkRun(contents) {
        this.port.postMessage({ id: 'compileLinkRun', data: contents });
    }

    onmessage(event) {
      if (event.data.id === 'write') {
          let data = event.data.data;
          let filteredData = data.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');
          let consoleElement = document.querySelector('.console-output-here');
          if (consoleElement) {
              consoleElement.textContent += filteredData;
              if (filteredData.includes("Error: process exited with code 1.")) {
                  editor.setOption("showGutter", true);
                  hideSpinner();
              }
              else if (filteredData.includes("test.wasm")) {
                  hideSpinner();
              }
              window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: 'smooth'
              });
              smoothScrollToBottom('right-box');
            }
        }
    }
}

const api = new WorkerAPI();

document.querySelector('.run-the-code').addEventListener('click', async function() {
    editor.setOption("showGutter", false);
    showSpinner();
    let inputValues = document.querySelector('.program-input').value;
    inputValues = inputValues || '';
    //let prgOutput = '<span style="font-size:10px"><i class="fas fa-globe" style="color: lightgreen;"></i> Throw 2 Me (.com)</span> \n';
    document.querySelector('.prg-output').innerHTML = `<pre class='console-output-here' style='padding-bottom:2px;padding-left:5px;margin-bottom:0px'></pre>`;
    const code = editor.getValue();
    if (/scanf|fscanf|sscanf|getchar|fgetc|gets|fgets|getc|cin|getline|cin\.get|cin\.getline|cin\.read/.test(code) && !/\/\/capture input/.test(code))
    consoleElement.textContent += "*Please add \n //capture input \n comment in main in this app to capture input.";
    let inputCode = redirectInputsToStdin(code, inputValues);
    api.compileLinkRun(inputCode);
});

function redirectInputsToStdin(code, inputValues) {
    if (inputValues == null || inputValues == '') return code;
    if (code.includes("stdio.h")) {
        inputValues = inputValues.split('').reverse().join('');
        let modifiedCode = code.replace(/\/\/capture input\n/, `${[...inputValues].map(c => {
            if (c === '\n') {
                return `ungetc('\\n',stdin)`;
            }
            if (c === "'") {
                return `ungetc('\\'',stdin)`;
            }
            return `ungetc('${c}',stdin)`;
        }).join(',')};\n`);
        return modifiedCode;
    }
    else if (code.includes("iostream")) {
        inputValues = inputValues.split('').reverse().join('');
        let modifiedCode = code.replace(/\/\/capture input\n/, `${[...inputValues].map(c => {
          if (c === '\n') {
              return `cin.putback('\\n')`;
          }
          if (c === "'") {
              return `cin.putback('\\'')`;
          }
          return `cin.putback('${c}')`;
      }).join(',')};\n`);
      return modifiedCode;
  }
  return code;
}

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('cdn/cppwasm/service_worker.js').then(reg => {
        console.log('ServiceWorker registration succeeded: ', reg.scope);
    }).catch(error => {
        console.log('ServiceWorker registration failed: ', error);
    });
}
