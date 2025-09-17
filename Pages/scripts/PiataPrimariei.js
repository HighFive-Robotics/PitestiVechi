document.addEventListener('DOMContentLoaded', () => {
        
    
    const imageData = [
        { src: "https://placehold.co/600x800/02785D/FFFFFF?text=Imagine+1", alt: "Imagine istorică 1" },
        { src: "https://placehold.co/600x800/8658A4/FFFFFF?text=Imagine+2", alt: "Imagine istorică 2" },
        { src: "https://placehold.co/600x800/319B42/FFFFFF?text=Imagine+3", alt: "Imagine istorică 3" },
        { src: "https://placehold.co/600x800/BD83D8/FFFFFF?text=Imagine+4", alt: "Imagine istorică 4" },
        { src: "https://placehold.co/600x800/02785D/FFFFFF?text=Imagine+5", alt: "Imagine istorică 5" },
    ];

    const galleryContainer = document.querySelector('.gallery-container');
    const lightboxGrid = document.getElementById('lightbox-grid');
    const paginationContainer = document.querySelector('.carousel-pagination');

    
    imageData.forEach((imgData, index) => {
        const createImageWrapper = () => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-image-wrapper scroll-reveal';
            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.alt;
            wrapper.appendChild(img);
            return wrapper;
        };
        
        galleryContainer.appendChild(createImageWrapper());
        lightboxGrid.appendChild(createImageWrapper());

        const dot = document.createElement('button');
        dot.className = 'pagination-dot';
        dot.dataset.index = index;
        paginationContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.pagination-dot');
    const images = document.querySelectorAll('.gallery-container .gallery-image-wrapper');

    
    const arrowLeft = document.querySelector('.carousel-arrow.left');
    const arrowRight = document.querySelector('.carousel-arrow.right');

    const handleArrowClick = (direction) => {
        const scrollAmount = images[0].offsetWidth + parseInt(getComputedStyle(galleryContainer).gap);
        galleryContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };

    arrowLeft.addEventListener('click', () => handleArrowClick(-1));
    arrowRight.addEventListener('click', () => handleArrowClick(1));

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            images[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        });
    });

    
    const updateCarouselState = () => {
        const scrollLeft = galleryContainer.scrollLeft;
        const scrollWidth = galleryContainer.scrollWidth;
        const width = galleryContainer.clientWidth;

        arrowLeft.disabled = scrollLeft < 1;
        arrowRight.disabled = scrollLeft > scrollWidth - width - 1;

        
        let centerIndex = 0;
        let minDistance = Infinity;
        images.forEach((img, index) => {
            const imgRect = img.getBoundingClientRect();
            const containerRect = galleryContainer.getBoundingClientRect();
            const distance = Math.abs((imgRect.left + imgRect.width / 2) - (containerRect.left + containerRect.width / 2));
            if (distance < minDistance) {
                minDistance = distance;
                centerIndex = index;
            }
        });
        
        dots.forEach((dot, index) => dot.classList.toggle('active', index === centerIndex));
    };

    galleryContainer.addEventListener('scroll', updateCarouselState, { passive: true });
    updateCarouselState(); 

    
    let isDown = false;
    let startX;
    let scrollLeft;

    galleryContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        galleryContainer.classList.add('grabbing');
        startX = e.pageX - galleryContainer.offsetLeft;
        scrollLeft = galleryContainer.scrollLeft;
    });
    galleryContainer.addEventListener('mouseleave', () => {
        isDown = false;
        galleryContainer.classList.remove('grabbing');
    });
    galleryContainer.addEventListener('mouseup', () => {
        isDown = false;
        galleryContainer.classList.remove('grabbing');
    });
    galleryContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryContainer.offsetLeft;
        const walk = (x - startX) * 2; 
        galleryContainer.scrollLeft = scrollLeft - walk;
    });

    
    galleryContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            galleryContainer.scrollLeft += e.deltaY;
        }
    }, { passive: false });


    
    const lightbox = document.getElementById('lightbox');
    const openLightboxBtn = document.getElementById('open-lightbox-btn');
    const closeLightboxBtn = document.getElementById('lightbox-close-btn');

    openLightboxBtn.addEventListener('click', () => lightbox.classList.add('visible'));
    closeLightboxBtn.addEventListener('click', () => lightbox.classList.remove('visible'));

   
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || index * 50;
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    revealElements.forEach((el, index) => {
        el.dataset.delay = index * 50;
        observer.observe(el);
    });

 
    const gridContainer = document.getElementById('interactive-grid');
    const cellSize = 40;
    let dotsGrid = [];

    function createGrid() {
        gridContainer.innerHTML = '';
        const cols = Math.ceil(window.innerWidth / cellSize);
        const rows = Math.ceil(window.innerHeight / cellSize);
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        for (let i = 0; i < cols * rows; i++) {
            const dot = document.createElement('div');
            dot.className = 'grid-dot';
            gridContainer.appendChild(dot);
        }
        dotsGrid = document.querySelectorAll('.grid-dot');
    }

    function handleInteraction(x, y) {
    dotsGrid.forEach(dot => {
        const rect = dot.getBoundingClientRect();
        const dotX = rect.left + rect.width / 2;
        const dotY = rect.top + rect.height / 2;

        const distance = Math.sqrt((dotX - x) ** 2 + (dotY - y) ** 2);
        const maxDistance = 500; 

        if (distance < maxDistance) {
            const rippleStrength = 1 - (distance / maxDistance);
            const shockwaveDelay = distance * 1.5; 

            dot.style.transition = `
                transform 1000ms cubic-bezier(0.19, 1, 0.22, 1) ${shockwaveDelay}ms,
                background-color 1000ms ease ${shockwaveDelay}ms,
                opacity 1000ms ease ${shockwaveDelay}ms
            `;

            dot.style.transform = `scale(${1 + rippleStrength * 3}) translateZ(0)`;
            dot.style.backgroundColor = `rgba(134, 88, 164, ${rippleStrength * 0.7})`;
            dot.style.opacity = 1;

            
            setTimeout(() => {
                dot.style.transform = 'scale(1) translateZ(0)';
                dot.style.backgroundColor = '';
                dot.style.opacity = 1;
            }, 1000 + shockwaveDelay);
        }
    });
}
    
    let debounceTimeout;
    const handleEvent = (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);
            if (x === undefined) return;
            handleInteraction(x, y);
        }, 100);
    };

    window.addEventListener('mousedown', handleEvent);
    window.addEventListener('touchstart', handleEvent);
    window.addEventListener('resize', createGrid);
    createGrid();
});

