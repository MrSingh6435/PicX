document.addEventListener('DOMContentLoaded', () => {
    const pin = "HP100%";
    const input = document.getElementById('pin-input');
    const button = document.getElementById('pin-button');
    const pinContainer = document.querySelector('.pin-container');
    const main = document.querySelector('.outer-frame');
    const slideshowImage = document.getElementById('slideshow-image');
    const bgm = document.getElementById("bgm");
    let isMusicPlaying = false; // Variable to track music state
    let currentIndex = 0;

    // List of images for the slideshow
    const images = [
        'U.S/img (1)',
        'U.S/img (2)',
        'U.S/img (3)',
        'U.S/img (4)',
        'U.S/img (5)',
        'U.S/img (6)',
        'U.S/img (7)',
        'U.S/img (8)',
        'U.S/img (9)',
        'U.S/img (10)',
        'U.S/img (11)',
        'U.S/img (12)',
        'U.S/img (13)',
        'U.S/img (14)',
        'U.S/img (15)',
        'U.S/img (16)',
        'U.S/img (17)',
        'U.S/img (18)',
        'U.S/img (19)',
        'U.S/img (20)',
        'U.S/img (21)',
        'U.S/img (22)',
        'U.S/img (23)',
        'U.S/img (24)',
        'U.S/img (25)',
        'U.S/img (26)',
        'U.S/img (27)',
        'U.S/img (28)',
        'U.S/img (29)',
        'U.S/img (30)',
        'U.S/img (31)',
        'U.S/img (32)'
    ];

    function changeImage() {
        console.log(`Changing to: ${images[currentIndex]}`);
        slideshowImage.src = images[currentIndex];
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

        // Start background music
        bgm.volume = 0.15;
        bgm.play();
        isMusicPlaying = true; // Update music state
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const enteredPassword = input.value;
        if (enteredPassword === pin) {
            pinContainer.classList.add('hidden');
            main.classList.remove('hidden');
            startSlideshowAndMusic();
        } else {
            alert('Incorrect PIN. Please try again.');
        }
    }

    // Handle form submission when button is clicked
    button.addEventListener('click', handleFormSubmit);

    // Handle "Enter" key press for form submission
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && document.activeElement === input) {
            event.preventDefault();
            handleFormSubmit(event);
        }

        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault(); // Prevent default action for Ctrl+M
            if (isMusicPlaying) {
                bgm.pause();
            } else {
                bgm.play();
            }
            isMusicPlaying = !isMusicPlaying; // Toggle music state
        }
    });

    // Triple touch functionality on the entire document
    let touchCount = 0;
    let touchTimeout;

    document.addEventListener('touchend', () => {
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
        touchTimeout = setTimeout(() => {
            touchCount = 0;
        }, 500); // Adjust this value as needed for responsiveness
    });

    function disableRightClickAndInspect() {
        // Disable right-click
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        // Disable F12 and Ctrl+Shift+I (common shortcuts for developer tools)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
                event.preventDefault();
            }
        });

        // Optional: Disable Ctrl+U (view source)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'u') {
                event.preventDefault();
            }
        });
    }

    // Call the function on page load
    disableRightClickAndInspect();
});
