document.addEventListener('DOMContentLoaded', function() {
    resizeBoxes();
});

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
        document.querySelector('.prg-editor').style.border = '1px solid rgb(200,200,200)';
        document.querySelector('.prg-editor').style.boxSizing = 'border-box';
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

        document.querySelector('.prg-editor').style.height = windowHeight - totalHeight -12 + 'px';

    } 
    else {
        document.querySelector('.prg-editor').style.border = '1px solid rgb(200,200,200)';
        document.querySelector('.prg-editor').style.boxSizing = 'border-box';
        document.querySelector('.prg-editor').style.height = windowHeight*0.65 + 'px';
    }
}
