document.addEventListener('DOMContentLoaded', function() {
    const photos = document.querySelectorAll('.photo img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox img');
    const prevBtn = document.querySelector('.lightbox-nav .prev');
    const nextBtn = document.querySelector('.lightbox-nav .next');
    const lightboxNav = document.querySelector('.lightbox-nav');
    
    let currentIndex = 0;
    let navTimer;
    const photoSources = Array.from(photos).map(photo => photo.src);
    
    // Functions to show/hide navigation
    function showNavigation() {
        lightboxNav.style.opacity = '1';
    }
    
    function hideNavigation() {
        lightboxNav.style.opacity = '0';
    }
    
    // Open lightbox when clicking on a photo
    photos.forEach((photo, index) => {
        photo.addEventListener('click', function() {
            currentIndex = index;
            lightboxImg.src = this.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Show navigation initially and set timer
            showNavigation();
            resetNavTimer();
        });
    });
    
    // Reset navigation timer
    function resetNavTimer() {
        clearTimeout(navTimer);
        navTimer = setTimeout(hideNavigation, 2000); // 10 seconds
    }
    
    // Mouse movement shows navigation and resets timer
    lightbox.addEventListener('mousemove', function() {
        showNavigation();
        resetNavTimer();
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target !== lightboxImg && !e.target.closest('.lightbox-nav')) {
            closeLightbox();
        }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navigate(-1);
    });
    
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navigate(1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') navigate(-1);
        else if (e.key === 'ArrowRight') navigate(1);
        else if (e.key === 'Escape') closeLightbox();
    });
    
    // Swipe functionality for mobile
    let touchstartX = 0;
    let touchendX = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
        touchstartX = e.changedTouches[0].screenX;
        showNavigation();
        resetNavTimer();
    });
    
    lightbox.addEventListener('touchend', function(e) {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50;
        if (touchendX < touchstartX - threshold) navigate(1); // Swipe left
        if (touchendX > touchstartX + threshold) navigate(-1); // Swipe right
    }
    
    // Navigate between photos
    function navigate(direction) {
        currentIndex += direction;
        
        // Loop around if we reach the end
        if (currentIndex < 0) currentIndex = photoSources.length - 1;
        if (currentIndex >= photoSources.length) currentIndex = 0;
        
        lightboxImg.src = photoSources[currentIndex];
        showNavigation();
        resetNavTimer();
    }
    
    // Close the lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
        clearTimeout(navTimer);
    }
});
