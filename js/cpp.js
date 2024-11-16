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
    const windowHeight = window.innerHeight;
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
    editor.insert("//Code\n");
    //document.querySelector('.program-input').value = '';
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
      console.log(event.data.data);
    }
  }
}

const api = new WorkerAPI();

document.querySelector('.run-the-code').addEventListener('click', async function() {
    editor.setOption("showGutter", true);
    //const inputValues = document.querySelector('.program-input').value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
    //const code = editor.getValue().replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
    const code = editor.getValue();
    api.compileLinkRun(code);
});

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('cdn/cppwasm/service_worker.js').then(reg => {
    console.log('ServiceWorker registration succeeded: ', reg.scope);
  }).catch(error => {
    console.log('ServiceWorker registration failed: ', error);
  });
}
