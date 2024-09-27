document.addEventListener("DOMContentLoaded", function() {
    const animatedText = document.querySelector('.animated-text');
    setTimeout(() => {
        animatedText.classList.add('fade-in');
    }, 100);
});
