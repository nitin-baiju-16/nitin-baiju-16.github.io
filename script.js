// Scroll animation for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' ? false : true;
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', expanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = expanded ? 'hidden' : '';
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without jumping
            history.pushState(null, null, targetId);
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Stop observing after animation
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .slide-in, .scale-in, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Typing effect for hero text
const typingElement = document.getElementById('typing-text');
if (typingElement) {
    const originalText = typingElement.textContent;
    typingElement.textContent = '';
    let i = 0;
    let typingStarted = false;
    
    function typeWriter() {
        if (i < originalText.length) {
            typingElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing when hero section is visible
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !typingStarted) {
                typingStarted = true;
                typeWriter();
            }
        });
    }, { threshold: 0.5 });
    
    typingObserver.observe(typingElement);
}

// Back to top button functionality
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update copyright year dynamically
const yearElement = document.getElementById('current-year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Add active class to nav links based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Handle escape key for mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Lazy loading for any future images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
    // Update navbar
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
    
    // Update active nav link
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScroll);

//--------------------------

// Animated background effect (no mouse interaction)
const animatedBackground = (function() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'animated-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Allows clicking through canvas
    canvas.style.zIndex = '-1'; // Places it behind all content
    canvas.style.opacity = '0.5'; // Subtle effect
    
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let time = 0;
    
    // Particle class for floating effect
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            // Colors: cyan (#00d4ff) and purple (#7b2cbf)
            this.color = Math.random() > 0.5 ? 
                `rgba(0, 212, 255, ${Math.random() * 0.3})` : 
                `rgba(123, 44, 191, ${Math.random() * 0.3})`;
            this.phase = Math.random() * Math.PI * 2; // For wave motion
        }
        
        update() {
            // Gentle floating motion with sine waves for organic feel
            this.x += this.speedX + Math.sin(time + this.phase) * 0.1;
            this.y += this.speedY + Math.cos(time + this.phase) * 0.1;
            
            // Wrap around screen edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
            
            // Occasionally change speed for more dynamic effect
            if (Math.random() < 0.005) {
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Handle resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Reinitialize particles on resize
        particles = [];
        for (let i = 0; i < 40; i++) { // Fewer particles for cleaner look
            particles.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        time += 0.01; // Slowly increment time for wave effects
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw flowing gradient lines for depth
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
        ctx.lineWidth = 1;
        
        // Horizontal flowing lines
        for (let i = 0; i < 5; i++) {
            const y = (canvas.height / 5) * i + Math.sin(time + i) * 20;
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < canvas.width; x += 50) {
                const waveY = y + Math.sin(x * 0.02 + time * 2) * 10;
                ctx.lineTo(x, waveY);
            }
            ctx.strokeStyle = `rgba(0, 212, 255, 0.03)`;
            ctx.stroke();
        }
        
        // Vertical flowing lines
        for (let i = 0; i < 5; i++) {
            const x = (canvas.width / 5) * i + Math.cos(time + i) * 20;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            for (let y = 0; y < canvas.height; y += 50) {
                const waveX = x + Math.cos(y * 0.02 + time * 2) * 10;
                ctx.lineTo(waveX, y);
            }
            ctx.strokeStyle = `rgba(123, 44, 191, 0.03)`;
            ctx.stroke();
        }
        
        // Add subtle glowing orbs that slowly move
        for (let i = 0; i < 3; i++) {
            const gradient = ctx.createRadialGradient(
                canvas.width * (0.3 + 0.4 * Math.sin(time * 0.3 + i)),
                canvas.height * (0.3 + 0.4 * Math.cos(time * 0.2 + i)),
                0,
                canvas.width * (0.3 + 0.4 * Math.sin(time * 0.3 + i)),
                canvas.height * (0.3 + 0.4 * Math.cos(time * 0.2 + i)),
                150
            );
            gradient.addColorStop(0, i === 0 ? 'rgba(0, 212, 255, 0.1)' : 'rgba(123, 44, 191, 0.1)');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        requestAnimationFrame(animate);
    }
    
    // Initialize
    window.addEventListener('resize', resizeCanvas);
    
    // Start
    resizeCanvas();
    animate();
    
    // Return cleanup function (optional)
    return function cleanup() {
        window.removeEventListener('resize', resizeCanvas);
        canvas.remove();
    };
})();
