// Replace everything in nav.js with this code

document.addEventListener('DOMContentLoaded', () => {

    // This is a safe helper function to get user data without crashing
    const getAuth = () => {
        const token = localStorage.getItem('lmsToken');
        const userJSON = localStorage.getItem('lmsUser');
        if (token && userJSON) {
            try {
                const user = JSON.parse(userJSON);
                return { token, user };
            } catch (error) {
                // If JSON is corrupted, clear storage and treat as logged out
                localStorage.clear();
                return { token: null, user: null };
            }
        }
        return { token: null, user: null };
    };

    const { user } = getAuth();
    const navDropdown = document.getElementById('nav-user-dropdown');
    const navLoginButton = document.getElementById('nav-login-button');

    if (user && navDropdown) {
        // --- USER IS LOGGED IN ---
        navDropdown.style.display = 'block';
        if (navLoginButton) navLoginButton.style.display = 'none';

        // Populate user info
        const userNameEl = document.getElementById('header-dropdown-name');
        const userAvatarEl = document.getElementById('header-dropdown-avatar');
        
        if (userNameEl) {
            userNameEl.textContent = `${user.firstName} ${user.lastName}`;
        }
        if (userAvatarEl && user.avatar) {
            userAvatarEl.src = `/${user.avatar}`;
        }

        // Add role-specific dashboard link
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            dashboardLink.href = user.role === 'instructor' ? 'instructor-dashboard.html' : 'student-dashboard.html';
        }
        
        // Setup Logout Button
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('lmsToken');
                localStorage.removeItem('lmsUser');
                window.location.href = 'login.html';
            });
        }
    } else {
        // --- USER IS NOT LOGGED IN ---
        if (navDropdown) navDropdown.style.display = 'none';
        if (navLoginButton) navLoginButton.style.display = 'block';
    }
});