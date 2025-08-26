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

    const guestLinks = document.querySelectorAll('.guest-link');
    const userDropdowns = document.querySelectorAll('.rbt-user-wrapper');

    if (token && user) {
        // --- USER IS LOGGED IN ---
        guestLinks.forEach(el => el.style.display = 'none');
        userDropdowns.forEach(el => el.style.display = 'block');

        // Populate user name
        const fullName = user.name || `${user.firstName} ${user.lastName}`;
        document.querySelectorAll('#header-dropdown-name').forEach(el => { 
            if(el) el.textContent = fullName;
        });

        // Populate user avatar using the new shared class
        if (user.avatar) {
            const avatarPath = `/${user.avatar}`;
            document.querySelectorAll('.header-user-avatar').forEach(img => img.src = avatarPath);
        }

        // Show/hide menu items based on user role
        if (user.role === 'instructor') {
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
        } else {
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

    } else {
        // --- USER IS LOGGED OUT ---
        guestLinks.forEach(el => el.style.display = 'block');
        userDropdowns.forEach(el => el.style.display = 'none');
    }

    // --- UNIVERSAL LOGOUT HANDLER ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('lmsToken');
            localStorage.removeItem('lmsUser');
            window.location.href = 'login.html';
        });
    }
});