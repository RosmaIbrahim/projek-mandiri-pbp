document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================================
    // NAVIGASI & MOBILE MENU LOGIC
    // =========================================================

    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 1. Mobile Menu Toggle
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            // Mengubah posisi mobile menu agar muncul tepat di bawah header fixed
            mobileMenu.style.top = `${document.getElementById('main-header').offsetHeight}px`;
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. Fungsi untuk menandai link aktif (garis biru)
    function setActiveLink(sectionId) {
        navLinks.forEach(link => {
            // Hapus kelas aktif dari semua link
            link.classList.remove('active');
            link.classList.remove('text-primary-dark');
            link.classList.add('text-gray-600');
            
            // Tambahkan kelas aktif ke link yang sesuai
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
                link.classList.add('text-primary-dark');
                link.classList.remove('text-gray-600');
            }
        });
    }

    // =========================================================
    // SCROLL REVEAL & ACTIVE LINK (Intersection Observer)
    // =========================================================

    const sections = document.querySelectorAll('section');
    
    // Karena Navbar fixed, kita ambil tingginya untuk rootMargin
    const mainHeader = document.getElementById('main-header');
    // Tambahkan delay kecil untuk memastikan header sudah dimuat
    const headerHeight = mainHeader ? mainHeader.offsetHeight : 72; 

    // Margin atas: toleransi di bawah header (72px + 15px).
    const thresholdOffsetTop = headerHeight + 15; 
    
    // Margin bawah yang agresif (95% dari viewport height) untuk deteksi cepat
    const thresholdOffsetBottom = window.innerHeight * 0.95; 

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Panggil setActiveLink jika section muncul di area deteksi
                setActiveLink(entry.target.id);

                // Mengaktifkan Scroll Reveal untuk item di dalam section
                entry.target.querySelectorAll('.reveal-item').forEach((item) => {
                    // Hanya terapkan jika belum memiliki kelas opacity-100
                    if (!item.classList.contains('opacity-100')) {
                        const delay = parseInt(item.getAttribute('data-delay')) || 0;
                        setTimeout(() => {
                            item.classList.add('opacity-100');
                        }, delay);
                    }
                });
            }
        });
    }, {
        // rootMargin Kunci Perbaikan:
        rootMargin: `-${thresholdOffsetTop}px 0px -${thresholdOffsetBottom}px 0px`, 
        threshold: 0 
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // 3. Animasi awal untuk Hero Section
    document.querySelectorAll('.hero-item-initial').forEach(item => {
        const delay = parseInt(item.getAttribute('data-delay')) || 0;
        setTimeout(() => {
            item.classList.add('hero-item-animate');
        }, delay);
    });
    
    // =========================================================
    // LOGIKA GALERI PKL (Carousel - Disesuaikan untuk 2 Foto/Slide)
    // =========================================================
    
    const galleryContainer = document.getElementById('gallery-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (galleryContainer && prevBtn && nextBtn) {
        
        let scrollAmount = 0; 
        
        function calculateScrollAmount() {
            const itemElement = galleryContainer.querySelector('.flex-shrink-0');
            if (!itemElement) return 0;
            
            const itemWidth = itemElement.offsetWidth;
            
            // Menggunakan 16px untuk gap (space-x-4) 
            const gap = 16; 
            
            if (window.innerWidth >= 640) { // Screen Medium (sm) ke atas: 2 foto terlihat
                // Menggeser 2 foto penuh + 1 gap
                scrollAmount = (itemWidth * 2) + gap; 
            } else {
                // Layar kecil: Menggeser 1 foto penuh + 1 gap
                scrollAmount = itemWidth + gap; 
            }
            return scrollAmount; 
        }
        
        // Hitung ulang saat resize, untuk memastikan scrollAmount benar
        window.addEventListener('resize', () => {
            calculateScrollAmount();
            checkScrollPosition(); 
        });
        calculateScrollAmount(); // Panggil saat DOMContentLoaded

        function scrollGallery(direction) {
            // Pastikan scrollAmount dihitung ulang sebelum digeser
            const currentAmount = calculateScrollAmount(); 
            
            galleryContainer.scrollBy({
                left: direction === 'next' ? currentAmount : -currentAmount,
                behavior: 'smooth'
            });
            
            // Cek posisi setelah animasi scroll selesai
            setTimeout(checkScrollPosition, 350); 
        }

        function checkScrollPosition() {
            const maxScroll = galleryContainer.scrollWidth - galleryContainer.clientWidth;
            const currentScroll = galleryContainer.scrollLeft;
            
            // Tombol 'Prev'
            if (currentScroll < 5) { // Toleransi 5px
                prevBtn.style.opacity = '0';
                prevBtn.style.pointerEvents = 'none';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.pointerEvents = 'auto';
            }

            // Tombol 'Next'
            if (maxScroll - currentScroll < 5) { // Toleransi 5px
                nextBtn.style.opacity = '0';
                nextBtn.style.pointerEvents = 'none';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.pointerEvents = 'auto';
            }
        }

        nextBtn.addEventListener('click', () => scrollGallery('next'));
        prevBtn.addEventListener('click', () => scrollGallery('prev'));
        
        checkScrollPosition(); // Panggil pertama kali untuk menyembunyikan tombol 'Prev'
        galleryContainer.addEventListener('scroll', checkScrollPosition); 
    }
});