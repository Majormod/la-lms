document.addEventListener('DOMContentLoaded', () => {

    // Safe helper function to get user data without crashing
    const getAuth = () => {
        const token = localStorage.getItem('lmsToken');
        const userJSON = localStorage.getItem('lmsUser');
        if (token && userJSON) {
            try {
                return { token, user: JSON.parse(userJSON) };
            } catch (error) {
                localStorage.clear();
                return { token: null, user: null };
            }
        }
        return { token: null, user: null };
    };

    const { token, user } = getAuth();

    // --- Selectors that match YOUR HTML structure ---
    const loginLink = document.getElementById('nav-login-link');
    const userLink = document.getElementById('nav-user-link');

    if (token && user) {
        // --- 1. USER IS LOGGED IN ---
        if (loginLink) loginLink.classList.add('d-none');
        if (userLink) userLink.classList.remove('d-none');

        // Populate user info (Handles both 'name' and 'firstName'/'lastName')
        const userNameEl = document.getElementById('nav-user-name');
        const userNameDropdownEl = document.getElementById('nav-user-name-dropdown');
        const userAvatarEl = document.getElementById('nav-user-avatar');

        if (userNameEl) userNameEl.textContent = user.firstName || user.name.split(' ')[0];
        if (userNameDropdownEl) userNameDropdownEl.textContent = user.name || `${user.firstName} ${user.lastName}`;
        if (userAvatarEl && user.avatar) userAvatarEl.src = `/${user.avatar}`;

        // Handle role-specific links
        if (user.role === 'instructor') {
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
        } else {
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

    } else {
        // --- 2. USER IS LOGGED OUT ---
        if (loginLink) loginLink.classList.remove('d-none');
        if (userLink) userLink.classList.add('d-none');
    }

    // --- 3. UNIVERSAL LOGOUT HANDLER ---
    // This runs regardless of login state and finds ALL logout buttons.
    const logoutButtons = document.querySelectorAll('.logout-btn, #nav-logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            localStorage.removeItem('lmsToken');
            localStorage.removeItem('lmsUser');
            window.location.href = 'login.html';
        });
    });
});