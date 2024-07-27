document.addEventListener('DOMContentLoaded', () => {
    const pin = "HP100%";
    const input = document.getElementById('pin-input');
    const button = document.getElementById('pin-button');
    const pinContainer = document.querySelector('.pin-container');
    const main = document.querySelector('.outer-frame');
    const slideshowImage = document.getElementById('slideshow-image');
    const slideshowImage1 = document.getElementById('slideshow-image1');
    const bgm = document.getElementById("bgm");
    const touchArea = document.querySelector('.touch-area');
    let isMusicPlaying = false;
    let currentIndex = 0;
    let isFullScreen = false;
    let touchCount = 0;
    let touchTimeout;
    let access = false;

    const images = [
        'U.S/m (1)', 'U.S/m (2)', 'U.S/m (3)', 'U.S/m (4)', 'U.S/m (5)',
        'U.S/m (6)', 'U.S/m (7)', 'U.S/m (8)', 'U.S/m (9)', 'U.S/m (10)',
        'U.S/m (11)', 'U.S/m (12)', 'U.S/m (13)', 'U.S/m (14)', 'U.S/m (15)',
        'U.S/m (16)', 'U.S/m (17)'
    ];

    function changeImage() {
        console.log(`Changing to: ${images[currentIndex]}`);
        slideshowImage.src = images[currentIndex];
        slideshowImage1.src = images[currentIndex];
        currentIndex = (currentIndex + 1) % images.length;
        setTimeout(analyzeImage, 500);
    }

    function analyzeImage() {
        let img = new Image();
        img.src = slideshowImage.src;
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let avgColor = getAverageColor(imgData);
            document.body.style.backgroundColor = `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`;
        };
    }

    function getAverageColor(imgData) {
        let r = 0, g = 0, b = 0;
        let totalPixels = imgData.width * imgData.height;
        for (let i = 0; i < imgData.data.length; i += 4) {
            r += imgData.data[i];
            g += imgData.data[i + 1];
            b += imgData.data[i + 2];
        }
        r = Math.floor(r / totalPixels);
        g = Math.floor(g / totalPixels);
        b = Math.floor(b / totalPixels);
        return { r, g, b };
    }

    function startSlideshowAndMusic() {
        changeImage();
        setInterval(changeImage, 5000);
        bgm.volume = 0.5;
        bgm.play();
        isMusicPlaying = true;
    }

    function handleFormSubmit(event) { // Unlock
        event.preventDefault();
        const enteredPassword = input.value;
        if (enteredPassword === pin) {
            toggleBrowserFullscreen();
            access = true;
            startSlideshowAndMusic();
            pinContainer.classList.add('hidden');
            main.classList.remove('hidden');
            touchArea.classList.add('active');
        } else {
            alert('Incorrect PIN. Please try again.');
        }
    }

    function toggleBrowserFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    

    button.addEventListener('click', handleFormSubmit);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && document.activeElement === input) {
            handleFormSubmit(event);
        }

        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            if (isMusicPlaying) {
                bgm.pause();
            } else {
                bgm.play();
            }
            isMusicPlaying = !isMusicPlaying;
        }

        if (event.key === 'f' && access) {
            isFullScreen = toggleFullScreen(isFullScreen);
        }
    });

    touchArea.addEventListener('touchend', () => {
        touchCount++;
        if (touchCount === 3) {
            if (isMusicPlaying) {
                bgm.pause();
            } else {
                bgm.play();
            }
            isMusicPlaying = !isMusicPlaying;
            touchCount = 0;
        }
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => touchCount = 0, 500);
    });

    function toggleFullScreen(isFullScreen) {
        if (isFullScreen) {
            main.classList.remove('hidden');
            document.querySelector('.full-size').classList.add('hidden');
        } else {
            main.classList.add('hidden');
            document.querySelector('.full-size').classList.remove('hidden');
        }
        return !isFullScreen;
    }

    [slideshowImage, slideshowImage1].forEach(img => {
        slideshowImage.addEventListener('touchend', () => {
            touchCount++;
            if (touchCount === 3) {
                isFullScreen = toggleFullScreen(isFullScreen);
                touchCount = 0;
            }
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => touchCount = 0, 500);
        });
    });

    function disableRightClickAndInspect() {
        document.addEventListener('contextmenu', (event) => event.preventDefault());
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
                event.preventDefault();
            }
            if (event.ctrlKey && event.key === 'u') {
                event.preventDefault();
            }
        });
    }

    disableRightClickAndInspect();
});
