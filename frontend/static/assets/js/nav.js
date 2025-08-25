// Replace everything in nav.js with this final, universal version

document.addEventListener('DOMContentLoaded', () => {

    const getAuth = () => {
        const token = localStorage.getItem('lmsToken');
        const userJSON = localStorage.getItem('lmsUser');
        if (token && userJSON) {
            try { return { token, user: JSON.parse(userJSON) }; } 
            catch (error) {
                localStorage.clear();
                return { token: null, user: null };
            }
        }
        return { token: null, user: null };
    };

    const { user } = getAuth();
    const loginLink = document.getElementById('nav-login-link');
    const userLink = document.getElementById('nav-user-link');

    if (user) {
        // --- USER IS LOGGED IN ---
        if (loginLink) loginLink.classList.add('d-none');
        if (userLink) userLink.classList.remove('d-none');

        const userNameEl = document.getElementById('nav-user-name');
        const userNameDropdownEl = document.getElementById('nav-user-name-dropdown');
        const userAvatarEl = document.getElementById('nav-user-avatar');

        if (userNameEl) userNameEl.textContent = user.firstName || '';
        if (userNameDropdownEl) userNameDropdownEl.textContent = `${user.firstName} ${user.lastName}`;
        if (userAvatarEl && user.avatar) userAvatarEl.src = `/${user.avatar}`;

        if (user.role === 'instructor') {
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
        } else {
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

    } else {
        // --- USER IS LOGGED OUT ---
        if (loginLink) loginLink.classList.remove('d-none');
        if (userLink) userLink.classList.add('d-none');
    }

    // --- UNIVERSAL LOGOUT HANDLER ---
    // This finds ALL elements with the .logout-btn class and makes them work.
    const logoutButtons = document.querySelectorAll('.logout-btn');
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