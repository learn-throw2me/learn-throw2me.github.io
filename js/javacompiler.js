document.querySelector('.run-the-code').addEventListener('click', function () {
    showSpinner();
    hideLineNum();
    document.querySelector('.prg-output').innerHTML = `<pre class='console-output-here' style='padding-bottom:2px;padding-left:5px;margin-bottom:0px'>Output:\n</pre>`;
    var fs = BrowserFS.BFSRequire("fs");
    var process = BrowserFS.BFSRequire('process');
    var buffer = BrowserFS.BFSRequire("buffer").Buffer;

    (function () {
        var mfs = new BrowserFS.FileSystem.MountableFileSystem();
        BrowserFS.initialize(mfs);
        mfs.mount('/tmp', new BrowserFS.FileSystem.InMemory());
        var home = new BrowserFS.FileSystem.InMemory();
        mfs.mount('/home', home);

        function mountZipAndLoad(n) {
            mfs.mount("/doppio_home", new BrowserFS.FileSystem.ZipFS(new buffer(n)));
            if (document.readyState === 'complete') {
                afterLoad();
            } else {
                window.addEventListener('load', afterLoad);
            }
        }

        var t = new XMLHttpRequest();
        t.open("GET", "/cdn/doppio/doppio_home.zip");
        t.responseType = "arraybuffer";
        t.addEventListener("load", function () {
            mountZipAndLoad(t.response);
        });
        t.send();
    })();

    function afterLoad() {
        var textareaOutput = document.querySelector('.console-output-here');
        var textareaCode = editor.getValue();
        var textareaInput = document.querySelector('.program-input');
        
        process.initializeTTYs();
        process.chdir('/home');
        
        process.stdout.removeAllListeners('data');
        process.stderr.removeAllListeners('data');

        process.stdout.on('data', function (data) {
            textareaOutput.textContent += data.toString();
            hideSpinner();
            hideLineNum();
            goToBottom();
        });
        
        process.stderr.on('data', function (data) {
            textareaOutput.textContent += data.toString()
            if (data.toString().includes("Error:"))
            {
                hideSpinner();
                showLineNum();
            }
            goToBottom();
        });
        

        fs.readdir('/tmp', function (err, files) {
            if (!err) {
                files.forEach(file => fs.unlinkSync(`/tmp/${file}`));
            }
            fs.writeFileSync('/tmp/Main.java', textareaCode);

            Doppio.VM.CLI(
                ['-classpath', '/doppio_home', 'classes.util.Javac', '/tmp/Main.java'],
                {
                    doppioHomePath: '/doppio_home'
                },
                function (exitCode) {
                    if (exitCode === 0) {
                        Doppio.VM.CLI(
                            ['-classpath', '/tmp', 'Main'],
                            {
                                doppioHomePath: '/doppio_home'
                            }
                        );

                        if (textareaInput.value != null && textareaInput.value !== "")
                            process.stdin.write(textareaInput.value + "\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n");
                        else
                            process.stdin.write("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n");
                            
                        hideSpinner();
                        showLineNum();
                        goToBottom();

                    } else {
                        textareaOutput.textContent += "Error: Compilation failed.\n";
                        
                        hideSpinner();
                        showLineNum();
                        goToBottom();
                    }
                }
            );
        });
    }
});
