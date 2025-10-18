// ==================== MOBILE MENU TOGGLE ====================
function toggleMenu() {
    const header = document.getElementById('header');
    header.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (header.classList.contains('active') && 
        !header.contains(event.target) && 
        !menuToggle.contains(event.target)) {
        header.classList.remove('active');
    }
});

// ==================== SMOOTH SCROLLING ====================
let isScrolling = false;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            isScrolling = true;
            
            // Remove active from all links
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active to clicked link
            this.classList.add('active');
            
            // Close mobile menu with animation
            const header = document.getElementById('header');
            header.classList.remove('active');
            
            // Smooth scroll to target
            const targetPosition = target.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
                else isScrolling = false;
            }
            
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// ==================== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ====================
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when skills section is visible
            if (entry.target.id === 'skills') {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ==================== ANIMATE SKILL BARS ====================
function animateSkillBars() {
    const skills = document.querySelectorAll('.skill-progress');
    skills.forEach((skill, index) => {
        const width = skill.parentElement.parentElement.querySelector('h4 span').textContent;
        skill.style.setProperty('--skill-width', width);
        
        // Delay each skill bar animation slightly
        setTimeout(() => {
            skill.style.width = width;
        }, index * 100);
    });
}

// ==================== FORM SUBMISSION HANDLER ====================
function handleSubmit(event) {
    event.preventDefault();
    
    const button = event.target.querySelector('.btn-submit');
    const originalText = button.textContent;
    
    // Animate button
    button.textContent = 'Envoi en cours...';
    button.style.transform = 'scale(0.95)';
    
    // Simulate sending delay
    setTimeout(() => {
        button.textContent = '✓ Envoyé!';
        button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        // Show success message
        showNotification('Message envoyé avec succès! Je vous répondrai bientôt.', 'success');
        
        // Reset form
        event.target.reset();
        
        // Reset button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.transform = '';
        }, 3000);
    }, 1500);
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Notification styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '20px 30px',
        background: type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #c82333)',
        color: '#fff',
        borderRadius: '50px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: '10000',
        fontWeight: '600',
        fontSize: '15px',
        transform: 'translateX(400px)',
        transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// ==================== TYPING EFFECT FOR HERO SECTION ====================
const typed = document.querySelector('.typed');
if (typed) {
    const text = typed.textContent;
    typed.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            typed.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        } else {
            // Keep the cursor blinking
            typed.style.borderRight = '3px solid var(--secondary)';
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 800);
}

// ==================== ACTIVE NAV BASED ON SCROLL ====================
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    // Debounce scroll event
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 50);
});

// ==================== PARALLAX EFFECT FOR HERO ====================
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const hero = document.getElementById('hero');
            if (hero) {
                const scrolled = window.pageYOffset;
                const heroHeight = hero.offsetHeight;
                
                // Only apply parallax when hero is in view
                if (scrolled < heroHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                    hero.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
                }
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ==================== ADD LOADING ANIMATION ====================
window.addEventListener('load', () => {
    // Remove any loading screens if they exist
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Trigger animations
    document.body.style.opacity = '1';
    
    // Make hero section immediately visible
    const hero = document.getElementById('hero');
    if (hero) {
        hero.classList.add('visible');
    }
});

// ==================== TABLE READY ====================
// Table is now always visible without animations

// ==================== IMAGE LAZY LOADING ====================
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                img.style.transition = 'all 0.6s ease';
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            }, 100);
            
            imageObserver.unobserve(img);
        }
    });
}, { threshold: 0.1 });

images.forEach(img => {
    imageObserver.observe(img);
});

// ==================== PREVENT FLASH OF UNSTYLED CONTENT ====================
document.addEventListener('DOMContentLoaded', () => {
    // Ensure smooth transitions on page load
    document.body.style.transition = 'opacity 0.3s ease';
    
    // Initialize animations for visible sections
    const visibleSections = document.querySelectorAll('section');
    visibleSections.forEach((section, index) => {
        if (index === 0) { // Hero section
            section.classList.add('visible');
        }
    });
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Reduce motion for users who prefer it
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// ==================== EASTER EGG: KONAMI CODE ====================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);
    
    if (konamiCode.join('').includes(konamiPattern.join(''))) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        showNotification('🎉 Code secret activé! 🎉', 'success');
        
        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});

// ==================== FIX: ENSURE SKILLS ARE PROPERLY INITIALIZED ====================
window.addEventListener('load', () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.setAttribute('data-width', width);
        bar.style.width = '0';
    });
});