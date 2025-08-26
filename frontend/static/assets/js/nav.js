// Replace everything in nav.js with this final, corrected code

document.addEventListener('DOMContentLoaded', () => {

    const getAuth = () => {
        const token = localStorage.getItem('lmsToken');
        const userJSON = localStorage.getItem('lmsUser');
        if (token && userJSON) {
            try {
                return { token, user: JSON.parse(userJSON) };
            } catch (error) {
                // If user data is corrupted, clear it and log out
                localStorage.clear();
                return { token: null, user: null };
            }
        }
        return { token: null, user: null };
    };

    const { token, user } = getAuth();

    // Select all user-related elements in the header
    const guestLinks = document.querySelectorAll('.guest-link'); // e.g., Login/Register buttons
    const userDropdowns = document.querySelectorAll('.rbt-user-wrapper');

    if (token && user) {
        // --- 1. USER IS LOGGED IN ---

        // Hide guest links, show user dropdowns
        guestLinks.forEach(el => el.style.display = 'none');
        userDropdowns.forEach(el => el.style.display = 'block'); // Or 'list-item' if appropriate

        // Populate user name and avatar in all dropdowns
        const fullName = user.name || `${user.firstName} ${user.lastName}`;
        document.querySelectorAll('#header-dropdown-name').forEach(el => el.textContent = fullName);

        if (user.avatar) {
            const avatarPath = `/${user.avatar}`;
            document.querySelectorAll('#header-dropdown-avatar, #header-dropdown-avatar-2').forEach(img => img.src = avatarPath);
        }

        // Show/hide menu items based on user role
        if (user.role === 'instructor') {
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
        } else { // Assumes 'student' or any other role
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

    } else {
        // --- 2. USER IS LOGGED OUT ---

        // Show guest links, hide user dropdowns
        guestLinks.forEach(el => el.style.display = 'block'); // Or 'list-item'
        userDropdowns.forEach(el => el.style.display = 'none');
    }

    // --- 3. UNIVERSAL LOGOUT HANDLER ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('lmsToken');
            localStorage.removeItem('lmsUser');
            window.location.href = 'login.html'; // Redirect to login page
        });
    }
});