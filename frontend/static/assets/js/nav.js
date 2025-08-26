// This is the final, complete nav.js with role-specific menus restored.

document.addEventListener('DOMContentLoaded', () => {

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

    const { user } = getAuth();
    const loginLink = document.getElementById('nav-login-link');
    const userLink = document.getElementById('nav-user-link');

    if (user) {
        // --- USER IS LOGGED IN ---
        if (loginLink) loginLink.classList.add('d-none');
        if (userLink) userLink.classList.remove('d-none');

        // Populate user name and avatar
        const userNameEl = document.getElementById('nav-user-name');
        const userNameDropdownEl = document.getElementById('nav-user-name-dropdown');
        const userAvatarEl = document.getElementById('nav-user-avatar');

        if (userNameEl) userNameEl.textContent = user.firstName;
        if (userNameDropdownEl) userNameDropdownEl.textContent = `${user.firstName} ${user.lastName}`;
        if (userAvatarEl && user.avatar) userAvatarEl.src = `/${user.avatar}`;

        // --- THIS SECTION RESTORES YOUR ROLE-SPECIFIC MENU ---
        if (user.role === 'instructor') {
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
            
            // Hide student items that don't have the class
            const bookmarkLink = document.getElementById('nav-bookmark-link');
            const reviewsLink = document.getElementById('nav-reviews-link');
            if (bookmarkLink) bookmarkLink.style.display = 'none';
            if (reviewsLink) reviewsLink.style.display = 'none';

        } else { // Assumes 'student' role
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

    } else {
        // --- USER IS LOGGED OUT ---
        if (loginLink) loginLink.classList.remove('d-none');
        if (userLink) userLink.classList.add('d-none');
    }

    // --- UNIVERSAL LOGOUT HANDLER ---
    const logoutButtons = document.querySelectorAll('.logout-btn, #nav-logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('lmsToken');
            localStorage.removeItem('lmsUser');
            window.location.href = 'login.html';
        });
    });
});