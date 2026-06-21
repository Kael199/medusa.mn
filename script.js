/* ============================================================
   AkiraScans — Asura-style interactions
   ============================================================ */

(() => {
    'use strict';

    const { HERO_SLIDES, TRENDING, POPULAR, LATEST, GENRES, cover } = window.AKIRA_DATA;

    /* ---------- HELPERS ---------- */
    const $  = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const el = (tag, attrs = {}, children = []) => {
        const node = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => {
            if (k === 'class') node.className = v;
            else if (k === 'html') node.innerHTML = v;
            else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
            else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
            else node.setAttribute(k, v);
        });
        (Array.isArray(children) ? children : [children]).forEach(c => {
            if (c == null) return;
            node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
        });
        return node;
    };

    const toast = (msg) => {
        const t = $('#toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._t);
        t._t = setTimeout(() => t.classList.remove('show'), 2400);
    };

    /* ---------- THEME ---------- */
    const themeBtn = $('#themeToggle');
    const stored = localStorage.getItem('akira-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    themeBtn.innerHTML = document.documentElement.getAttribute('data-theme') === 'light'
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';
    themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('akira-theme', next);
        themeBtn.innerHTML = next === 'light'
            ? '<i class="fa-solid fa-moon"></i>'
            : '<i class="fa-solid fa-sun"></i>';
        toast(next === 'light' ? 'Light mode on' : 'Dark mode on');
    });

    /* ---------- MOBILE DRAWER ---------- */
    const drawer = $('#drawer');
    const scrim  = $('#scrim');
    const openDrawer  = () => { drawer.classList.add('open');    drawer.setAttribute('aria-hidden', 'false'); scrim.hidden = false; document.body.style.overflow = 'hidden'; };
    const closeDrawer = () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');  scrim.hidden = true;  document.body.style.overflow = ''; };
    $('#mobileMenuBtn').addEventListener('click', openDrawer);
    $('#closeDrawer').addEventListener('click', closeDrawer);
    scrim.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

    /* ---------- SCROLL PROGRESS ---------- */
    const scrollProg = $('#scrollProgress');
    const updateProgress = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? h.scrollTop / max : 0;
        scrollProg.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    /* ============================================================
       GENERIC EMBLA-LIKE CAROUSEL (asura uses embla)
       ============================================================ */
    function makeCarousel(opts) {
        const container = $(opts.container);
        const prevBtn    = opts.prev ? $(opts.prev) : null;
        const nextBtn    = opts.next ? $(opts.next) : null;
        const dotsEl     = opts.dots ? $(opts.dots) : null;
        const slides     = opts.slides || [];
        const autoplay   = opts.autoplay || 0;

        let idx = 0;

        function render() {
            container.innerHTML = '';
            container.style.transform = `translateX(-${idx * 100}%)`;
            slides.forEach(s => container.appendChild(s.node));
            if (dotsEl) {
                dotsEl.innerHTML = '';
                slides.forEach((_, i) => {
                    const d = el('button', {
                        class: 'dot' + (i === idx ? ' active' : ''),
                        'aria-label': `Slide ${i + 1}`,
                        onclick: () => { idx = i; update(); }
                    });
                    dotsEl.appendChild(d);
                });
            }
        }
        function update() {
            container.style.transform = `translateX(-${idx * 100}%)`;
            if (dotsEl) {
                $$('.dot', dotsEl).forEach((d, i) => d.classList.toggle('active', i === idx));
            }
        }
        function next() { idx = (idx + 1) % slides.length; update(); }
        function prev() { idx = (idx - 1 + slides.length) % slides.length; update(); }

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        let timer;
        if (autoplay > 0) {
            timer = setInterval(next, autoplay);
            container.addEventListener('mouseenter', () => clearInterval(timer));
            container.addEventListener('mouseleave', () => { timer = setInterval(next, autoplay); });
        }

        render();

        return { next, prev, go: i => { idx = i; update(); } };
    }

    /* ============================================================
       HERO SLIDES
       ============================================================ */
    function buildHeroSlides() {
        return HERO_SLIDES.map((s, i) => {
            const c = cover(i + 100, s.palette);
            const slide = el('div', { class: 'hero-slide', style: { background: s.bg } });
            slide.innerHTML = `
                <div class="hero-slide-inner">
                    <div class="hero-cover" style="background:${c.background}">
                        <div class="icon">${c.icon}</div>
                    </div>
                    <div class="hero-info">
                        <span class="badge-rank">${s.badge}</span>
                        <h1>${s.title}</h1>
                        <p class="author"><i class="fa-solid fa-pen-nib"></i> ${s.author}</p>
                        <p class="desc">${s.desc}</p>
                        <div class="meta-row">
                            <span><i class="fa-solid fa-star"></i> ${s.meta[0]}</span>
                            <span><i class="fa-solid fa-eye"></i> ${s.meta[1]}</span>
                            <span><i class="fa-solid fa-fire"></i> ${s.meta[2]}</span>
                        </div>
                        <div class="btn-row">
                            <button class="btn-start" onclick="window.__open && window.__open('${s.title.replace(/'/g, "\\'")}')"><i class="fa-solid fa-book-open"></i> Start Reading</button>
                            <button class="btn-bookmark" onclick="window.__bookmark && window.__bookmark('${s.title.replace(/'/g, "\\'")}')"><i class="fa-regular fa-bookmark"></i> Bookmark</button>
                        </div>
                    </div>
                </div>
            `;
            return { node: slide };
        });
    }
    window.__open = title => toast('Starting: ' + title);
    window.__bookmark = title => toast('Bookmarked: ' + title);

    /* ============================================================
       MANGA CARD BUILDER
       ============================================================ */
    function mangaCard(m, palette) {
        const c = cover((m._i || 0), palette || m.palette || 'red-blue');
        const card = el('article', {
            class: 'manga-card reveal',
            tabindex: '0',
            'aria-label': m.title,
        });
        const coverDiv = el('div', { class: 'cover' });
        const img = el('div', { class: 'cover-img', style: { background: c.background } });
        const pat = el('div', { style: { position: 'absolute', inset: '0', background: c.pattern } });
        const icon = el('div', { class: 'icon' }, c.icon);
        img.append(pat, icon);

        if (m.type) coverDiv.appendChild(el('span', { class: 'type-badge' }, m.type));
        if (m.rating) coverDiv.appendChild(el('span', { class: 'rating-badge', html: `<i class="fa-solid fa-star"></i> ${m.rating}` }));
        if (m.tag) coverDiv.appendChild(el('span', { class: 'ch-tag' }, m.tag));

        coverDiv.appendChild(img);

        const info = el('div', { class: 'info' }, [
            el('h3', { class: 'title' }, m.title),
            el('div', { class: 'chapters', html: m.chapters || `<b>${m.chapter || ''}</b> ${m.time ? '· ' + m.time : ''}` }),
            m.genres ? el('div', { class: 'genres' }, m.genres.slice(0, 3).join(' · ')) : null,
        ]);

        card.append(coverDiv, info);
        card.addEventListener('click', () => toast('Opening: ' + m.title));
        return card;
    }

    /* ============================================================
       TRENDING ROW
       ============================================================ */
    function buildTrendingSlides() {
        return TRENDING.slice(0, 12).map((m, i) => {
            const card = mangaCard({ ...m, _i: i, type: 'Manhwa', tag: 'HOT' }, m.palette);
            return { node: card };
        });
    }

    /* ============================================================
       LATEST UPDATES GRID
       ============================================================ */
    let latestCount = 10;
    function renderLatest() {
        const grid = $('#latestGrid');
        grid.innerHTML = '';
        LATEST.slice(0, latestCount).forEach((m, i) => {
            const c = mangaCard({ ...m, _i: i + 30, type: m.type || 'Manhwa', rating: m.rating }, m.palette);
            grid.appendChild(c);
        });
        observeReveals();
    }

    /* ============================================================
       POPULAR LIST (sidebar)
       ============================================================ */
    function renderPopular() {
        const list = $('#popularList');
        list.innerHTML = '';
        POPULAR.slice(0, 10).forEach((m, i) => {
            const c = cover(i + 200, m.palette);
            const item = el('li', {
                class: 'popular-item top' + (i + 1),
                tabindex: '0',
            });
            const coverDiv = el('div', { class: 'cover', style: { background: c.background } });
            const icon = el('div', {
                style: {
                    position: 'absolute', inset: '0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,.4))'
                }
            }, c.icon);
            coverDiv.appendChild(icon);

            const info = el('div', { class: 'info' }, [
                el('div', { class: 'name' }, m.title),
                el('div', {
                    class: 'meta',
                    html: `<span class="rate"><i class="fa-solid fa-star"></i> ${m.rating}</span><span>${m.chapters || ''}</span>`,
                }),
            ]);

            item.append(el('span', { class: 'rank' }, String(i + 1)), coverDiv, info);
            item.addEventListener('click', () => toast('Opening: ' + m.title));
            list.appendChild(item);
        });
    }

    /* ============================================================
       GENRE CLOUD
       ============================================================ */
    function renderGenres() {
        const cloud = $('#genreCloud');
        cloud.innerHTML = '';
        GENRES.forEach(g => {
            const a = el('a', { class: 'genre-tag', href: '#' }, g);
            a.addEventListener('click', e => { e.preventDefault(); toast('Genre: ' + g); });
            cloud.appendChild(a);
        });
    }

    /* ============================================================
       SEG CONTROL (popular range)
       ============================================================ */
    $$('.seg').forEach(s => s.addEventListener('click', () => {
        $$('.seg').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        toast(`Popular — ${s.dataset.range}`);
    }));

    /* ============================================================
       NAV DROPDOWN
       ============================================================ */
    $$('.nav-dropdown-btn').forEach(b => b.addEventListener('click', e => {
        e.preventDefault();
        const menu = b.nextElementSibling;
        const isOpen = menu.style.opacity === '1';
        $$('.dropdown-menu').forEach(m => { m.style.opacity = ''; m.style.pointerEvents = ''; m.style.transform = ''; });
        if (!isOpen) {
            menu.style.opacity = '1';
            menu.style.pointerEvents = 'auto';
            menu.style.transform = 'none';
        }
    }));
    document.addEventListener('click', e => {
        if (!e.target.closest('.nav-dropdown')) {
            $$('.dropdown-menu').forEach(m => { m.style.opacity = ''; m.style.pointerEvents = ''; m.style.transform = ''; });
        }
    });

    /* ============================================================
       SEARCH
       ============================================================ */
    const sInput = $('#searchInput');
    const sBox   = $('#searchForm');
    const sList  = $('#searchResults');
    const allSearchable = [
        ...HERO_SLIDES.map(s => ({ title: s.title, kind: 'Featured' })),
        ...TRENDING.map(s => ({ title: s.title, kind: 'Trending' })),
        ...POPULAR.map(s => ({ title: s.title, kind: 'Popular' })),
        ...LATEST.map(s => ({ title: s.title, kind: 'Latest' })),
    ];

    function renderSearch(q) {
        const items = allSearchable.filter(m => m.title.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
        if (!items.length) {
            sList.innerHTML = `<div style="padding:18px;text-align:center;color:var(--text-3);font-size:13px;">No results for "<b>${q}</b>"</div>`;
            sList.hidden = false;
            return;
        }
        sList.innerHTML = items.map(m => {
            const c = cover(0, 'red-blue');
            return `<div class="search-result">
                <div class="sr-thumb" style="background:${c.background}"></div>
                <div class="sr-info">
                    <div class="sr-title">${m.title}</div>
                    <div class="sr-meta">${m.kind}</div>
                </div>
                <i class="fa-solid fa-arrow-right" style="color:var(--text-3);font-size:11px;"></i>
            </div>`;
        }).join('');
        sList.hidden = false;
    }

    sInput.addEventListener('input', e => {
        const q = e.target.value.trim();
        if (!q) { sList.hidden = true; return; }
        renderSearch(q);
    });
    sInput.addEventListener('focus', () => { if (sInput.value.trim()) renderSearch(sInput.value.trim()); });
    sList.addEventListener('click', e => {
        const r = e.target.closest('.search-result');
        if (!r) return;
        toast('Opening: ' + r.querySelector('.sr-title').textContent);
        sList.hidden = true; sInput.value = '';
    });
    document.addEventListener('click', e => { if (!sBox.contains(e.target)) sList.hidden = true; });

    document.addEventListener('keydown', e => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            sInput.focus();
        }
    });

    /* ============================================================
       LOAD MORE
       ============================================================ */
    $('#loadMoreBtn').addEventListener('click', () => {
        if (latestCount >= LATEST.length) {
            toast("You've reached the end 🎉");
            return;
        }
        latestCount = Math.min(latestCount + 10, LATEST.length);
        renderLatest();
        toast('Loaded more');
    });

    /* ============================================================
       NEWSLETTER
       ============================================================ */
    $('#newsForm').addEventListener('submit', e => {
        e.preventDefault();
        const email = $('#newsEmail').value.trim();
        if (!email || !email.includes('@')) {
            toast('Enter a valid email');
            $('#newsEmail').focus();
            return;
        }
        toast('Subscribed! Check your inbox');
        e.target.reset();
    });

    /* ============================================================
       REVEAL ON SCROLL
       ============================================================ */
    let revealObs;
    function observeReveals() {
        if (!('IntersectionObserver' in window)) {
            $$('.reveal').forEach(r => r.classList.add('in-view'));
            return;
        }
        if (!revealObs) {
            revealObs = new IntersectionObserver((entries) => {
                entries.forEach((e, i) => {
                    if (e.isIntersecting) {
                        setTimeout(() => e.target.classList.add('in-view'), i * 40);
                        revealObs.unobserve(e.target);
                    }
                });
            }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
        }
        $$('.reveal').forEach(r => revealObs.observe(r));
    }

    /* ============================================================
       RIPPLE EFFECT
       ============================================================ */
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-start, .btn-bookmark, .btn-load');
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(r.width, r.height) * 2;
        ripple.style.cssText = `
            position:absolute;border-radius:50%;pointer-events:none;
            background:rgba(255,255,255,.4);transform:scale(0);
            width:${size}px;height:${size}px;
            left:${e.clientX - r.left - size/2}px;
            top:${e.clientY - r.top - size/2}px;
            animation:ripple .6s ease-out;
        `;
        if (!document.querySelector('#ripple-style')) {
            const s = document.createElement('style');
            s.id = 'ripple-style';
            s.textContent = '@keyframes ripple{to{transform:scale(1);opacity:0;}}';
            document.head.appendChild(s);
        }
        if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
        if (getComputedStyle(btn).overflow !== 'hidden') btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });

    /* ============================================================
       INIT
       ============================================================ */
    function init() {
        // Hero carousel (autoplay)
        makeCarousel({
            container: '#heroEmbla',
            prev: '#heroPrev',
            next: '#heroNext',
            dots: '#heroDots',
            slides: buildHeroSlides(),
            autoplay: 5500,
        });

        // Trending row (manual nav)
        makeCarousel({
            container: '#trendingEmbla',
            prev: '#trendingPrev',
            next: '#trendingNext',
            slides: buildTrendingSlides(),
        });

        renderLatest();
        renderPopular();
        renderGenres();
        observeReveals();
        setTimeout(() => toast('Welcome to AkiraScans 📚'), 600);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();