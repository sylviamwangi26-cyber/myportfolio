document.addEventListener('DOMContentLoaded', () => {
    
    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // Initialize Typed.js
    if (document.getElementById('typed')) {
        new Typed('#typed', {
            strings: [
                'Website Developer',
                'Web App Builder',
                'Social Media Manager',
                'Digital Marketer',
                'AI & Automation Specialist',
                'Systems Designer'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            autoInsertCss: true
        });
    }

    // Initialize tsParticles
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            background: {
                color: { value: "transparent" }
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, links: { opacity: 0.5 } }
                }
            },
            particles: {
                color: { value: "#C9A84C" },
                links: {
                    color: "#C9A84C",
                    distance: 150,
                    enable: true,
                    opacity: 0.2,
                    width: 1
                },
                collisions: { enable: false },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "bounce" },
                    random: false,
                    speed: 0.5,
                    straight: false
                },
                number: {
                    density: { enable: true, area: 800 },
                    value: 40
                },
                opacity: { value: 0.3 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } }
            },
            detectRetina: true
        });
    }

    // Initialize Three.js 3D Globe
    const initThreeJS = () => {
        const container = document.getElementById('canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Globe Group
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // Globe Sphere
        const geometry = new THREE.SphereGeometry(5, 50, 50);
        
        const material = new THREE.MeshBasicMaterial({
            color: 0x161D42,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        
        const globe = new THREE.Mesh(geometry, material);
        globeGroup.add(globe);

        // Add some glowing particles to the globe surface
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 200;
        const posArray = new Float32Array(particleCount * 3);
        
        for(let i=0; i < particleCount * 3; i+=3) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 5.05;
            
            posArray[i] = r * Math.sin(phi) * Math.cos(theta);
            posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
            posArray[i+2] = r * Math.cos(phi);
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xC9A84C,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const globeParticles = new THREE.Points(particleGeometry, particleMaterial);
        globeGroup.add(globeParticles);

        // Positioning Pins
        const createPin = (lat, lon, color) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            const r = 5.1;
            
            const x = -(r * Math.sin(phi) * Math.cos(theta));
            const z = (r * Math.sin(phi) * Math.sin(theta));
            const y = (r * Math.cos(phi));
            
            const pinGeom = new THREE.SphereGeometry(0.1, 16, 16);
            const pinMat = new THREE.MeshBasicMaterial({ color: color });
            const pin = new THREE.Mesh(pinGeom, pinMat);
            pin.position.set(x, y, z);
            
            const ringGeom = new THREE.RingGeometry(0.12, 0.2, 32);
            const ringMat = new THREE.MeshBasicMaterial({ 
                color: color, 
                transparent: true, 
                opacity: 0.5,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.position.set(x, y, z);
            ring.lookAt(new THREE.Vector3(0,0,0));
            
            const pinGroup = new THREE.Group();
            pinGroup.add(pin);
            pinGroup.add(ring);
            
            return pinGroup;
        };

        const kenyaPin = createPin(-1.29, 36.82, 0xC9A84C); // Nairobi approx
        const europePin = createPin(51.5, -0.12, 0xFFFFFF); // London approx
        
        globeGroup.add(kenyaPin);
        globeGroup.add(europePin);

        camera.position.z = 15;
        globeGroup.position.x = window.innerWidth > 768 ? 4 : 0;
        globeGroup.position.y = 0;

        const animate = () => {
            requestAnimationFrame(animate);
            
            globeGroup.rotation.y += 0.002;
            globeGroup.rotation.x = 0.2;
            
            kenyaPin.children[1].scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.2);
            europePin.children[1].scale.setScalar(1 + Math.sin(Date.now() * 0.003 + Math.PI) * 0.2);
            
            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            globeGroup.position.x = window.innerWidth > 768 ? 4 : 0;
        });
    };

    initThreeJS();

    // GSAP Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // General Reveal elements
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach((element) => {
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleClass: "active",
                    once: true
                }
            });
        });
        
        // Parallax effect for section backgrounds
        gsap.utils.toArray('.section').forEach(section => {
            gsap.to(section, {
                backgroundPosition: `50% ${innerHeight / 2}px`,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom", 
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Timeline custom animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            let xOffset = item.classList.contains('timeline-left') ? -100 : 100;
            // Handle mobile where everything is left aligned
            if (window.innerWidth <= 768) {
                xOffset = 100;
            }
            
            gsap.fromTo(item, 
                { opacity: 0, x: xOffset },
                {
                    opacity: 1, 
                    x: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        once: true
                    }
                }
            );
        });

    } else {
        // Fallback if GSAP fails to load
        const revealFallback = () => {
            const reveals = document.querySelectorAll('.reveal, .timeline-item');
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 100;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("active");
                    reveals[i].style.opacity = 1; // for timeline fallback
                    reveals[i].style.transform = "translateX(0)";
                }
            }
        };
        window.addEventListener("scroll", revealFallback);
        revealFallback();
    }
});
