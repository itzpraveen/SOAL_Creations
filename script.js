document.addEventListener('DOMContentLoaded', () => {
    // Sticky Nav on Scroll
    const header = document.querySelector('.sticky');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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

    // Hero Canvas Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        const mouse = {
            x: null,
            y: null,
            radius: (canvas.height / 80) * (canvas.width / 80)
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.quadraticCurveTo(this.x + this.size / 2, this.y - this.size / 2, this.x, this.y - this.size);
                ctx.quadraticCurveTo(this.x - this.size / 2, this.y - this.size / 2, this.x, this.y);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 10;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 10;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 10;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 10;
                    }
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 5) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 2) - 1;
                let directionY = (Math.random() * 2) - 1;
                const colors = ['#2aa198', '#cb4b16', '#d33682', '#6c71c4'];
                let color = colors[Math.floor(Math.random() * colors.length)];

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(101, 123, 131, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            mouse.radius = (canvas.height / 80) * (canvas.width / 80);
            init();
        });

        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        init();
        animate();
    }

    // SVG Tree Animation
    const treeSVG = document.getElementById('tree-svg');
    if (treeSVG) {
        const svgNS = "http://www.w3.org/2000/svg";
        const trunk = document.createElementNS(svgNS, 'path');
        trunk.setAttribute('d', 'M50 100 V50');
        trunk.setAttribute('stroke', 'var(--accent-color-1)');
        trunk.setAttribute('stroke-width', '1');
        trunk.setAttribute('fill', 'none');
        treeSVG.appendChild(trunk);

        function createBranch(svg, x1, y1, angle, length, depth) {
            if (depth === 0) return;

            const x2 = x1 + Math.cos(angle) * length;
            const y2 = y1 - Math.sin(angle) * length;

            const branch = document.createElementNS(svgNS, 'path');
            branch.setAttribute('d', `M${x1} ${y1} L${x2} ${y2}`);
            branch.setAttribute('stroke', 'var(--accent-color-1)');
            branch.setAttribute('stroke-width', '1');
            branch.setAttribute('fill', 'none');
            branch.style.transition = `stroke-dashoffset ${depth * 0.5}s ease-out`;
            svg.appendChild(branch);

            const len = branch.getTotalLength();
            branch.style.strokeDasharray = len;
            branch.style.strokeDashoffset = len;

            setTimeout(() => {
                branch.style.strokeDashoffset = 0;
                createBranch(svg, x2, y2, angle - 0.5, length * 0.8, depth - 1);
                createBranch(svg, x2, y2, angle + 0.5, length * 0.8, depth - 1);
            }, 100);
        }
        
        const trunkPath = treeSVG.querySelector('path');
        const len = trunkPath.getTotalLength();
        trunkPath.style.strokeDasharray = len;
        trunkPath.style.strokeDashoffset = len;

        const treeObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateTree();
                treeObserver.disconnect();
            }
        }, { threshold: 0.5 });

        function animateTree() {
            trunkPath.style.transition = 'stroke-dashoffset 2s ease-out';
            trunkPath.style.strokeDashoffset = 0;

            setTimeout(() => {
                let branches = [];
                function growBranches() {
                    branches.forEach(branch => branch.remove());
                    branches = [];
                    
                    function createBranch(svg, x1, y1, angle, length, depth) {
                        if (depth === 0) return;

                        const x2 = x1 + Math.cos(angle) * length;
                        const y2 = y1 - Math.sin(angle) * length;

                        const branch = document.createElementNS(svgNS, 'path');
                        branch.setAttribute('d', `M${x1} ${y1} L${x2} ${y2}`);
                        branch.setAttribute('stroke', 'var(--accent-color)');
                        branch.setAttribute('stroke-width', '1');
                        branch.setAttribute('fill', 'none');
                        branch.style.transition = `stroke-dashoffset ${depth * 0.5}s ease-out`;
                        svg.appendChild(branch);
                        branches.push(branch);

                        const len = branch.getTotalLength();
                        branch.style.strokeDasharray = len;
                        branch.style.strokeDashoffset = len;

                        setTimeout(() => {
                            branch.style.strokeDashoffset = 0;
                            createBranch(svg, x2, y2, angle - (Math.random() * 0.5 + 0.25), length * 0.8, depth - 1);
                            createBranch(svg, x2, y2, angle + (Math.random() * 0.5 + 0.25), length * 0.8, depth - 1);
                            if (depth < 3) {
                                createParticle(svg, x2, y2);
                            }
                        }, 100);
                    }
                    createBranch(treeSVG, 50, 50, Math.PI / 2 - 0.5, 20, 5);
                    createBranch(treeSVG, 50, 50, Math.PI / 2 + 0.5, 20, 5);
                }
                
                growBranches();
                setInterval(growBranches, 5000);

            }, 2200);
        }

        function createParticle(svg, x, y) {
            const particle = document.createElementNS(svgNS, 'circle');
            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
            particle.setAttribute('r', 2);
            const colors = ['#2aa198', '#cb4b16', '#d33682', '#6c71c4'];
            particle.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
            svg.appendChild(particle);

            let anim = particle.animate([
                { transform: `translate(0, 0)`, opacity: 1 },
                { transform: `translate(${(Math.random() - 0.5) * 20}, 20px)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'ease-out'
            });
            anim.onfinish = () => particle.remove();
        }

        treeObserver.observe(treeSVG);
    }

    // Service Card Branch Animations
    const branchSVGs = document.querySelectorAll('.branch-svg');
    branchSVGs.forEach(svg => {
        const path = svg.querySelector('path');
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;

        const branchObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    path.style.transition = 'stroke-dashoffset 2s ease-out';
                    path.style.strokeDashoffset = 0;
                }, 200);
                branchObserver.disconnect();
            }
        }, { threshold: 0.5 });

        branchObserver.observe(svg);
    });

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.feature, .service-card');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
});
