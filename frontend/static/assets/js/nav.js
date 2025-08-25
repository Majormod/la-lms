// Replace everything in nav.js with this final, corrected code

document.addEventListener('DOMContentLoaded', () => {

    // Safe helper function to get user data without crashing
    const getAuth = () => {
        const token = localStorage.getItem('lmsToken');
        const userJSON = localStorage.getItem('lmsUser');
        if (token && userJSON) {
            try {
                const user = JSON.parse(userJSON);
                return { token, user };
            } catch (error) {
                localStorage.clear();
                return { token: null, user: null };
            }
        }
        return { token: null, user: null };
    };

    const { token, user } = getAuth();
    
    // --- CORRECTED SELECTORS to match your HTML ---
    const loginLink = document.getElementById('nav-login-link');
    const userLink = document.getElementById('nav-user-link');
    const userMenu = document.querySelector('.rbt-user-menu-list-wrapper');

    if (!loginLink || !userLink) {
        return; // Exit if essential nav elements aren't found
    }

    if (token && user) {
        // --- USER IS LOGGED IN ---
        loginLink.classList.add('d-none');   // Hide login link
        userLink.classList.remove('d-none'); // Show user link/dropdown trigger
        
        // Populate user info
        const userNameEl = document.getElementById('nav-user-name');
        const userNameDropdownEl = document.getElementById('nav-user-name-dropdown');
        const userAvatarEl = document.getElementById('nav-user-avatar');

        if (userNameEl) userNameEl.textContent = user.firstName || '';
        if (userNameDropdownEl) userNameDropdownEl.textContent = `${user.firstName} ${user.lastName}`;
        if (userAvatarEl && user.avatar) userAvatarEl.src = `/${user.avatar}`;
        
        // Handle role-specific links (from your original logic)
        if (user.role === 'instructor') {
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
            const bookmarkLink = document.getElementById('nav-bookmark-link');
            const reviewsLink = document.getElementById('nav-reviews-link');
            if(bookmarkLink) bookmarkLink.style.display = 'none';
            if(reviewsLink) reviewsLink.style.display = 'none';
        } else { // Assumes 'student' role
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

        // --- CORRECTED Logout Button ---
        const logoutButton = document.getElementById('nav-logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('lmsToken');
                localStorage.removeItem('lmsUser');
                window.location.href = 'login.html'; // Correct redirect
            });
        }

    } else {
        // --- USER IS LOGGED OUT ---
        loginLink.classList.remove('d-none'); // Show login link
        userLink.classList.add('d-none');    // Hide user link/dropdown trigger
    }
});