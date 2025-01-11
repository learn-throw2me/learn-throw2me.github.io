function loadCode() {
    const hash = window.location.hash;
    const path = hash.slice(1);
    let folder = null;
    let contentIndex = null;
    let fetchRoute = null;
    if (path == "" || path ==null)
        return;
    const firstTwoChars = path.slice(0, 2);
    switch (firstTwoChars) {
        case "cc":
        folder = "c/code";
        break;
        case "cp":
        folder = "cpp/code";
        break;
        case "ja":
        folder = "java/code";
        break;
        case "da":
        folder = "dsa/code";
        break;
        case "db":
        folder = "dbsql/code";
        break;
        case "we":
        folder = "web/code";
        break;
        case "py":
        folder = "python/code";
        break;
        default:
        folder = null;
    }

    if (folder) {
        const contentIndexValue = path.slice(2);
        contentIndex = parseInt(contentIndexValue, 10);
        if (isNaN(contentIndex)) {
        contentIndex = null;
        }
        if (contentIndex !== null) {
        fetchRoute = `/${folder}/${contentIndex}.txt`;

        fetch(fetchRoute)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
            })
            .then(codeContent => {
                const inputContent = extractContent('>>###input#start', '>>###input#end', codeContent);
                const precodeContent = extractContent('>>###precode#start', '>>###precode#end', codeContent);
                const codeSectionContent = extractContent('>>###code#start', '>>###code#end', codeContent);

                if (inputContent != "")
                    document.querySelector('.program-input').value = inputContent;
                if(precodeContent != "")
                    preCode = precodeContent;
                if(codeSectionContent !="") {
                    editor.setValue('', 1);
                    editor.insert(codeSectionContent + "\n");
                }
            });
        }
    }
}

function extractContent(delimiterStart, delimiterEnd, content) {
    const regex = new RegExp(`${delimiterStart}([\\s\\S]*?)${delimiterEnd}`);
    const match = content.match(regex);
    return match ? match[1].trim() : '';
}
