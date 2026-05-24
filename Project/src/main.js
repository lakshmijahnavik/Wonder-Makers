// Wondermakers Replica - Main Javascript & 3D Scene
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

  // ==========================================
  // 1. Theme Toggle Logic
  // ==========================================
  const themeButtons = document.querySelectorAll('.theme-button');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.textContent.toLowerCase();
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        localStorage.setItem('mode', 'dark');
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: 'dark' }));
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        localStorage.setItem('mode', 'light');
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: 'light' }));
      }

      // Force a quick reflow for stable CSS application in static-server mode
      // (ensures background/header update immediately after toggling)
      document.body.style.background = '';
      document.body.offsetHeight;
    });
  });

  // Apply saved mode on load
  const savedMode = localStorage.getItem('mode') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  // Keep classes strictly in sync so background + header theme switch reliably
  if (savedMode === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    localStorage.setItem('mode', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('mode', 'light');
  }


  // ==========================================
  // 2. Mobile Navigation Toggle
  // ==========================================
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  });

  // ==========================================
  // 3. Smooth Scrolling for Anchors
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==========================================
  // 4. Header Scroll styling
  // ==========================================
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 5. Scroll Fade In Animation
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Fade-in animation for content cards
  // NOTE: if IntersectionObserver doesn't fire in the browser, images/cards can remain hidden.
  // Keep this robust by making elements visible by default and animating only when intersecting.
  document.querySelectorAll('.project-card, .service-card, .build-card, .engagement-card, .edge-card, .faq-list details, .contact-info').forEach(el => {
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, background-color 0.3s ease, border-color 0.3s ease';
    // Set opacity after we know observer works
    el.style.opacity = '1';
    observer.observe(el);
  });


  // ==========================================
  // 6. Three.js Hero Star Background
  // ==========================================
  const canvas = document.getElementById('canvas');
  if (canvas) {
    let renderer, scene, camera;
    let mouseX = 0, mouseY = 0;
    let isAnimating = true;
    let starGroup = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const init = async () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 1.8, 6);

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);
      const fillLight = new THREE.DirectionalLight(0xfff0cc, 0.6);
      fillLight.position.set(-5, -3, 4);
      scene.add(fillLight);

      // Load star.glb
      const loader = new GLTFLoader();
      loader.load('assets/star.glb', (gltf) => {
        // Wrapper so we can center the model cleanly
        const wrapper = new THREE.Group();
        const model = gltf.scene;

        // Normalize size to ~3 units
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 6 / maxDim;
        model.scale.setScalar(scale);

        // Center the model at wrapper origin
        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        wrapper.add(model);
        // Position wrapper behind hero content — slightly right of center, behind text
        wrapper.position.set(0.3, 0.5, -0.5);
        scene.add(wrapper);
        starGroup = wrapper;

        // GSAP scroll-driven rotation + downward movement
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);

          if (!prefersReducedMotion) {
            const st = { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1 };

            gsap.to(starGroup.rotation, {
              y: '+=' + (Math.PI * 4),
              x: '+=' + Math.PI,
              ease: 'none',
              scrollTrigger: st
            });

            gsap.to(starGroup.position, {
              y: -6,
              ease: 'none',
              scrollTrigger: st
            });
          }
        }
      }, undefined, (err) => {
        console.warn('[3D] star.glb failed to load:', err);
      });

      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Pause rendering when canvas is fully off-screen
      new IntersectionObserver((entries) => {
        entries.forEach(e => { isAnimating = e.isIntersecting; });
      }, { threshold: 0 }).observe(canvas);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      if (!isAnimating) return;

      // Subtle idle z-spin while not scrolling (GSAP owns x & y rotation)
      if (starGroup && !prefersReducedMotion) {
        starGroup.rotation.z += 0.003;
      }

      // Gentle camera parallax on mouse
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
      camera.position.y += (1.8 - mouseY * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    init();
    animate();
  }
});
