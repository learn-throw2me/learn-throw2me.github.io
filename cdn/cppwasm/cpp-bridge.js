class WorkerAPI {
  constructor() {
    this.worker = new Worker('./cdn/cppwasm/worker.js');
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
  navigator.serviceWorker.register('./cdn/cppwasm/service_worker.js').then(reg => {
    console.log('ServiceWorker registration succeeded: ', reg.scope);
  }).catch(error => {
    console.log('ServiceWorker registration failed: ', error);
  });
}
