document.addEventListener('DOMContentLoaded', () => {
// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Sticky Nav on Scroll
const header = document.querySelector('.sticky');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Hero Text Animations
const heroHeading = document.querySelector('.hero-content h1');
if (heroHeading) {
    const text = heroHeading.textContent;
    heroHeading.textContent = '';
    const words = text.split(' ');
    let charCount = 0;

    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block'; // Keep word together
        
        for (let i = 0; i < word.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.textContent = word[i];
            charSpan.style.opacity = '0';
            charSpan.style.display = 'inline-block';
            wordSpan.appendChild(charSpan);

            gsap.to(charSpan, {
                opacity: 1,
                duration: 0.8,
                delay: (charCount + i) * 0.05,
                ease: 'power3.out'
            });
        }
        
        heroHeading.appendChild(wordSpan);
        charCount += word.length;

        if (index < words.length - 1) {
            const space = document.createTextNode(' ');
            heroHeading.appendChild(space);
            charCount++;
        }
    });
}

const heroParagraph = document.querySelector('.hero-content p');
if (heroParagraph) {
    gsap.fromTo(heroParagraph,
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: 0.8,
            ease: 'power3.out'
        }
    );
}

    // Enhanced Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    // Close mobile nav on link click
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileNav.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mobileNav.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Tabs
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');

            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    const colors = ['#f7d5a8', '#e9b7a3', '#a9c4a2', '#8fa88b', '#dda15e', '#bc6c25', '#606c38', '#283618'];
    // Hero Canvas Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        

        const mouse = {
            x: width / 2,
            y: height / 2,
            radius: 150
        };

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < 150; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
            
            requestAnimationFrame(animate);
        }

        // Optimized feature icon animations (runs separately from particle animation)
        function animateFeatureIcons() {
            const featureIcons = document.querySelectorAll('.feature-icon svg');
            featureIcons.forEach((icon, index) => {
                gsap.to(icon, {
                    y: Math.sin(Date.now() * 0.001 + index) * 5,
                    rotation: Math.sin(Date.now() * 0.001 + index) * 2,
                    duration: 2,
                    ease: 'none',
                    onComplete: animateFeatureIcons
                });
            });
        }
        
        // Start the feature icon animations only when in viewport
        ScrollTrigger.create({
            trigger: '.features-section',
            start: 'top 80%',
            onEnter: () => {
                animateFeatureIcons();
            },
            once: true
        });

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                        + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (width / 7) * (height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(46, 139, 87, ${opacityValue})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }

    // Scroll-triggered animations
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        gsap.fromTo(el,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Collaboration Animation
    const animationContainer = document.getElementById('collaboration-animation');
    if (animationContainer) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.overflow = 'visible';
        animationContainer.appendChild(svg);

        const numNodes = 20;
        const nodes = [];
        const lines = [];

        for (let i = 0; i < numNodes; i++) {
            const node = document.createElementNS(svgNS, "circle");
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            node.setAttribute('cx', `${x}%`);
            node.setAttribute('cy', `${y}%`);
            node.setAttribute('r', 4);
            node.setAttribute('fill', colors[i % colors.length]);
            svg.appendChild(node);
            nodes.push({ element: node, x, y, vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1 });
        }

        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                const line = document.createElementNS(svgNS, "line");
                line.setAttribute('x1', `${nodes[i].x}%`);
                line.setAttribute('y1', `${nodes[i].y}%`);
                line.setAttribute('x2', `${nodes[j].x}%`);
                line.setAttribute('y2', `${nodes[j].y}%`);
                line.setAttribute('stroke', 'rgba(0,0,0,0.1)');
                line.setAttribute('stroke-width', 1);
                svg.insertBefore(line, svg.firstChild);
                lines.push({ element: line, node1: nodes[i], node2: nodes[j] });
            }
        }

        function animate() {
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > 100) node.vx *= -1;
                if (node.y < 0 || node.y > 100) node.vy *= -1;

                node.element.setAttribute('cx', `${node.x}%`);
                node.element.setAttribute('cy', `${node.y}%`);
            });

            lines.forEach(line => {
                line.element.setAttribute('x1', `${line.node1.x}%`);
                line.element.setAttribute('y1', `${line.node1.y}%`);
                line.element.setAttribute('x2', `${line.node2.x}%`);
                line.element.setAttribute('y2', `${line.node2.y}%`);
            });

            requestAnimationFrame(animate);
        }

        ScrollTrigger.create({
            trigger: animationContainer,
            start: 'top 80%',
            onEnter: () => {
                animate();
            },
            once: true
        });
    }

// Optimized pulse animation for service cards (only when in viewport)
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        onEnter: () => {
            gsap.to(card, {
                y: -5,
                scale: 1.02,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                delay: index * 0.2
            });
        }
    });
});

// Section header animations
const sectionHeaders = document.querySelectorAll('h2');
sectionHeaders.forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// Persona Card Animation
const personaCards = document.querySelectorAll('.persona-card');
personaCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out'
    });
});

    // Why Choose Us Animation
    const whyChooseUsAnimationContainer = document.getElementById('why-choose-us-animation');
    if (whyChooseUsAnimationContainer) {
        const pastelColors = ['#f7d5a8', '#e9b7a3', '#a9c4a2', '#8fa88b'];
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.overflow = 'visible';
        whyChooseUsAnimationContainer.appendChild(svg);

        const numBubbles = 50;
        const bubbles = [];

        for (let i = 0; i < numBubbles; i++) {
            const bubble = document.createElementNS(svgNS, "circle");
            const r = Math.random() * 20 + 5;
            const x = Math.random() * 100;
            const y = 110 + Math.random() * 20;
            bubble.setAttribute('cx', `${x}%`);
            bubble.setAttribute('cy', `${y}%`);
            bubble.setAttribute('r', r);
            bubble.setAttribute('fill', pastelColors[i % pastelColors.length]);
            bubble.style.opacity = Math.random() * 0.5 + 0.2;
            svg.appendChild(bubble);
            bubbles.push({ element: bubble, x, y, r, vy: -(Math.random() * 0.1 + 0.05) });
        }

        function animate() {
            bubbles.forEach(bubble => {
                bubble.y += bubble.vy;
                bubble.element.setAttribute('cy', `${bubble.y}%`);

                if (bubble.y < -10) {
                    bubble.y = 110;
                }
            });

            requestAnimationFrame(animate);
        }

        ScrollTrigger.create({
            trigger: whyChooseUsAnimationContainer,
            start: 'top 80%',
            onEnter: () => {
                animate();
            },
            once: true
        });
    }

    // Clarity Icon Animation
    const clarityIcon = document.getElementById('clarity-icon');
    if (clarityIcon) {
        gsap.timeline({
            scrollTrigger: {
                trigger: clarityIcon,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        })
        .from("#clarity-line", { scaleY: 0, transformOrigin: 'top' })
        .from("#clarity-circle-2", { scale: 0, transformOrigin: 'center' })
        .from("#clarity-path", { scaleX: 0, transformOrigin: 'left' })
        .from("#clarity-circle-1", { scale: 0, transformOrigin: 'center' });
    }

    // Creativity Icon Animation
    const creativityIcon = document.getElementById('creativity-icon');
    if (creativityIcon) {
        gsap.timeline({
            scrollTrigger: {
                trigger: creativityIcon,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        })
        .from("#creativity-polygon", { y: -20, opacity: 0, duration: 0.5 })
        .from("#creativity-polyline-2", { y: -20, opacity: 0, duration: 0.5 }, "-=0.2")
        .from("#creativity-polyline-1", { y: -20, opacity: 0, duration: 0.5 }, "-=0.2");
    }


    // Partner Icon Animation
    const partnerIcon = document.getElementById('partner-icon');
    if (partnerIcon) {
        gsap.timeline({
            scrollTrigger: {
                trigger: partnerIcon,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        })
        .from("#partner-circle", { scale: 0, transformOrigin: 'center' })
        .from("#partner-path-1", { scaleX: 0, transformOrigin: 'right' })
        .from("#partner-path-3", { opacity: 0 })
        .from("#partner-path-2", { opacity: 0 });
    }
});
