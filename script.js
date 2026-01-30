document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const toggleInput = document.getElementById('theme-toggle-checkbox');
    const navLinks = document.querySelectorAll('header nav a');

    // --- Theme Handling ---
    function setTheme(mode) {
        html.setAttribute('color-mode', mode);
        localStorage.setItem('color-mode', mode);
        if (toggleInput) toggleInput.checked = (mode === 'dark');
    }

    setTheme(localStorage.getItem('color-mode') || 'light');

    if (toggleInput) {
        toggleInput.addEventListener('change', () => {
            setTheme(toggleInput.checked ? 'dark' : 'light');
        });
    }

    // --- Navigation Active Link ---
    function updateActiveLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        navLinks.forEach(link => {
            link.classList.remove('active');

            const linkPath = new URL(link.href).pathname;
            const linkHash = new URL(link.href).hash;

            // Wenn Link zur aktuellen Seite oder zum aktuellen Anker führt
            if (linkPath === currentPath && linkHash === currentHash) {
                link.classList.add('active');
            }
        });
    }

    // Initial
    updateActiveLink();

    // Klicks auf Links abfangen
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const linkUrl = new URL(link.href);
            const linkPath = linkUrl.pathname;
            const linkHash = linkUrl.hash;

            // Anker-Link auf derselben Seite
            if (linkPath === window.location.pathname && linkHash) {
                e.preventDefault();
                const targetEl = document.querySelector(linkHash);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });

                // Klasse setzen
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // URL ohne reload updaten
                history.pushState(null, '', linkHash);
            }
        });
    });

    // Back/Forward Buttons
    window.addEventListener('popstate', updateActiveLink);
});