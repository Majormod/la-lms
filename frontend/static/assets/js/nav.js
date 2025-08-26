// Replace everything in nav.js with this final, corrected code

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

    const { token, user } = getAuth();

    const guestNavItem = document.getElementById('guest-nav-item');
    const userNavItem = document.getElementById('user-nav-item');

    if (token && user) {
        // --- 1. USER IS LOGGED IN ---

        // Hide guest link, show user dropdown
        if (guestNavItem) guestNavItem.style.display = 'none';
        if (userNavItem) userNavItem.style.display = 'list-item';

        // Populate user name and avatar
        const fullName = user.name || `${user.firstName} ${user.lastName}`;
        document.getElementById('nav-user-name-dropdown').textContent = fullName;

        if (user.avatar) {
            const avatarPath = `/${user.avatar}`;
            document.getElementById('nav-user-avatar-icon').src = avatarPath;
            document.getElementById('nav-user-avatar-dropdown').src = avatarPath;
        }

        // Configure links and show/hide menu items based on user role
        if (user.role === 'instructor') {
            document.getElementById('nav-profile-link').href = 'instructor-profile.html';
            document.getElementById('nav-settings-link').href = 'instructor-settings.html';
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
        } else { // Assumes 'student' role
            document.getElementById('nav-profile-link').href = 'student-profile.html';
            document.getElementById('nav-settings-link').href = 'student-settings.html';
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

    } else {
        // --- 2. USER IS LOGGED OUT ---
        if (guestNavItem) guestNavItem.style.display = 'list-item';
        if (userNavItem) userNavItem.style.display = 'none';
    }

    // --- 3. UNIVERSAL LOGOUT HANDLER ---
    const logoutButton = document.getElementById('nav-logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('lmsToken');
            localStorage.removeItem('lmsUser');
            window.location.href = 'login.html';
        });
    }
});