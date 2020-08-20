let slider = {
    type: 'carousel',
    perView: 2,
    breakpoints: {
        960: {
            perView: 1
        }
    },
    keyboard: true
}

new Glide('.glide', slider).mount()
