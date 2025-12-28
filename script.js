// JavaScript for interactivity and dynamic behavior

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Animate skill bars when scrolled into view
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (barPosition < screenPosition) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }
    });
};

// Animate project cards on scroll
const projectCards = document.querySelectorAll('.project-card');

const animateProjectCards = () => {
    projectCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (cardPosition < screenPosition) {
            card.classList.add('visible');
        }
    });
};

const SERVICE_ID = 'service_n3g358l';
const TEMPLATE_ID = 'template_m3191o7';
const PUBLIC_KEY = 'Cz97TG5QoKP7xKW5z';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

// Form handling
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const recaptchaError = document.getElementById('recaptchaError');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.querySelector('#contactForm button[type="submit"]');

// Add loading state to button
const setLoading = (loading) => {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Sending...' : 'Send Message';
};

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate name
    if (nameInput.value.trim() === '') {
        nameError.style.display = 'block';
        nameInput.classList.add('error-border');
        isValid = false;
    } else {
        nameError.style.display = 'none';
        nameInput.classList.remove('error-border');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.style.display = 'block';
        emailInput.classList.add('error-border');
        isValid = false;
    } else {
        emailError.style.display = 'none';
        emailInput.classList.remove('error-border');
    }

    // Validate message
    if (messageInput.value.trim() === '') {
        messageError.style.display = 'block';
        messageInput.classList.add('error-border');
        isValid = false;
    } else {
        messageError.style.display = 'none';
        messageInput.classList.remove('error-border');
    }

    // Validate reCAPTCHA - robust validation to prevent bypass
    let recaptchaValid = false;
    try {
        // Check if grecaptcha is loaded
        if (typeof grecaptcha === 'undefined' || !grecaptcha.getResponse) {
            recaptchaError.textContent = 'reCAPTCHA is not loaded. Please refresh the page.';
            recaptchaError.style.display = 'block';
            isValid = false;
        } else {
            const recaptchaResponse = grecaptcha.getResponse();
            // Check if response exists and is not empty
            if (!recaptchaResponse || recaptchaResponse === '' || recaptchaResponse.length === 0) {
                recaptchaError.textContent = 'Please complete the reCAPTCHA verification';
                recaptchaError.style.display = 'block';
                isValid = false;
            } else {
                recaptchaValid = true;
                recaptchaError.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('reCAPTCHA validation error:', error);
        recaptchaError.textContent = 'reCAPTCHA validation failed. Please try again.';
        recaptchaError.style.display = 'block';
        isValid = false;
    }

    // If form is valid AND reCAPTCHA is valid, send email
    if (isValid && recaptchaValid) {
        setLoading(true);

        const templateParams = {
            from_name: nameInput.value.trim(),
            from_email: emailInput.value.trim(),
            message: messageInput.value.trim(),
            to_email: 'anup67393@gmail.com' // Your email address
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
            .then(() => {
                successMessage.style.display = 'block';
                successMessage.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
                grecaptcha.reset(); // Reset reCAPTCHA
                setLoading(false);

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                successMessage.style.display = 'block';
                successMessage.style.color = '#ff4d4d';
                successMessage.style.backgroundColor = 'rgba(255, 77, 77, 0.1)';
                successMessage.textContent = 'Sorry, there was an error sending your message. Please try again or contact me directly at anup67393@gmail.com';
                setLoading(false);

                // Hide error message after 10 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    successMessage.style.color = '#00ff00';
                    successMessage.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                }, 10000);
            });
    }
});

// Custom smooth scrolling function with fast animation
let scrollAnimationId = null;

function smoothScrollTo(targetPosition, duration = 800) {
    // Cancel any ongoing scroll animation
    if (scrollAnimationId !== null) {
        cancelAnimationFrame(scrollAnimationId);
    }

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Easing function for smooth acceleration and deceleration
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            scrollAnimationId = requestAnimationFrame(animation);
        } else {
            scrollAnimationId = null;
        }
    }

    scrollAnimationId = requestAnimationFrame(animation);
}

// Smooth scrolling for all anchor links with fast animation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Calculate duration based on distance for consistent speed
            const distance = Math.abs(targetPosition - window.pageYOffset);
            const baseDuration = 600; // Base duration in ms
            const maxDuration = 1000; // Max duration for very long scrolls
            const duration = Math.min(baseDuration + (distance / 3), maxDuration);

            // Use custom smooth scroll with dynamic duration
            smoothScrollTo(targetPosition, duration);

            // Update URL without triggering anchor jump
            history.pushState(null, '', targetId);
        });
    });
}

// Initialize smooth scrolling when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScrolling);
} else {
    initSmoothScrolling();
}

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const isLightTheme = document.body.classList.contains('light-theme');
    
    if (window.scrollY > 100) {
        // Darker/more opaque when scrolled for better visibility
        if (isLightTheme) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.backgroundColor = 'rgba(18, 18, 26, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.4)';
        }
    } else {
        // Slightly less opaque when at top
        if (isLightTheme) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(18, 18, 26, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    }

    // Trigger animations
    animateSkillBars();
    animateProjectCards();
});

// Initialize animations on page load
window.addEventListener('load', () => {
    animateSkillBars();
    animateProjectCards();
});

// Add floating effect to some elements
const floatingElements = document.querySelectorAll('.service-card, .skill-item');
floatingElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.transition = 'all 0.3s ease';
    });
});

// Add subtle background animation to hero section
const heroSection = document.querySelector('.hero');
window.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

    heroSection.style.backgroundPosition = `${xAxis}px ${yAxis}px`;
});

// Loading Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');

        // Remove loading screen from DOM after animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500); // Show loading for 1.5 seconds

    // Trigger other animations
    animateSkillBars();
    animateProjectCards();
});

// Dynamic Text Animation - Fixed
const textItems = [
    'Student',
    'Mathematics Enthusiast', 
    'Full-Stack Dev',
    'Chess & Strategy'
];

let currentIndex = 0;
let dynamicTextSpan = null;
let animationInterval = null;

function initDynamicText() {
    const dynamicTextContainer = document.querySelector('.dynamic-text');
    if (!dynamicTextContainer) return;

    // Create a single span element for the animated text
    dynamicTextSpan = document.createElement('span');
    dynamicTextContainer.innerHTML = '';
    dynamicTextContainer.appendChild(dynamicTextSpan);

    // Set initial styling for the container (only if not already set by CSS)
    if (!dynamicTextContainer.style.position) {
        dynamicTextContainer.style.position = 'relative';
    }
    if (!dynamicTextContainer.style.height) {
        dynamicTextContainer.style.height = '2.8rem';
    }

    // Set initial styling for the span element (set once)
    dynamicTextSpan.style.position = 'absolute';
    dynamicTextSpan.style.width = '100%';
    dynamicTextSpan.style.left = '0';
    dynamicTextSpan.style.top = '0';
    dynamicTextSpan.style.color = 'var(--accent-cyan)';
    dynamicTextSpan.style.fontSize = '1.8rem';
    dynamicTextSpan.style.fontWeight = '700';
    dynamicTextSpan.style.lineHeight = '2.8rem';
    dynamicTextSpan.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Set initial text
    dynamicTextSpan.textContent = textItems[currentIndex];
    dynamicTextSpan.style.opacity = '1';
    dynamicTextSpan.style.transform = 'translateY(0)';
}

function cycleText() {
    if (!dynamicTextSpan) return;
    
    // Fade out effect
    dynamicTextSpan.style.opacity = '0';
    dynamicTextSpan.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % textItems.length;
        dynamicTextSpan.textContent = textItems[currentIndex];
        
        // Fade in effect
        dynamicTextSpan.style.opacity = '1';
        dynamicTextSpan.style.transform = 'translateY(0)';
    }, 300);
}

// Initialize and start the animation after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initDynamicText();
        if (dynamicTextSpan) {
            animationInterval = setInterval(cycleText, 2500);
        }
    });
} else {
    initDynamicText();
    if (dynamicTextSpan) {
        animationInterval = setInterval(cycleText, 2500);
    }
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference - Default to dark theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
} else {
    // Explicitly ensure dark theme is default
    body.classList.remove('light-theme');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    localStorage.setItem('theme', 'dark');
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');

    if (body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});
