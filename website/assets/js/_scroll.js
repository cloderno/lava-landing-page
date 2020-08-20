const anchors = document.querySelectorAll('a[href*="#"]');

for (let i = 0; i <= anchors.length; i++) {
    anchors[i].addEventListener('click', (event) => {
        event.preventDefault();

        const blockId = anchors[i].getAttribute('href');
        document.querySelector('' + blockId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }) 
}