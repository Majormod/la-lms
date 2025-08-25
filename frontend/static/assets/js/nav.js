// This is the final, corrected nav.js based on your reverted code.

document.addEventListener('DOMContentLoaded', () => {

    // This safely gets the user data from localStorage without crashing.
    const getLoggedInUser = () => {
        const userJSON = localStorage.getItem('lmsUser');
        if (userJSON) {
            try {
                return JSON.parse(userJSON);
            } catch (error) {
                return null;
            }
        }
        return null;
    };

    const updateNavDropdown = () => {
        const token = localStorage.getItem('lmsToken');
        const user = getLoggedInUser();

        const loginLink = document.getElementById('nav-login-link');
        const userLink = document.getElementById('nav-user-link');
        
        // Exit if the main nav elements don't exist
        if (!loginLink || !userLink) {
            return;
        }

        if (token && user) {
            // --- USER IS LOGGED IN ---
            loginLink.classList.add('d-none');
            userLink.classList.remove('d-none');
            
            // Populate user name and avatar
            const userNameDropdownEl = document.getElementById('nav-user-name-dropdown');
            const userAvatarEl = document.getElementById('nav-user-avatar');

            if(userNameDropdownEl) {
                // Use the full name from the complete user object
                userNameDropdownEl.textContent = `${user.firstName} ${user.lastName}`;
            }

            if(userAvatarEl && user.avatar) {
                // Set the avatar from the user object
                userAvatarEl.src = `/${user.avatar}`;
            }

            // Handle role-specific links
            if (user.role === 'instructor') {
                document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
                
                // --- THIS IS THE FIX ---
                // Explicitly hide student-specific links for instructors.
                const bookmarkLink = document.getElementById('nav-bookmark-link');
                const reviewsLink = document.getElementById('nav-reviews-link');
                if (bookmarkLink) bookmarkLink.style.display = 'none';
                if (reviewsLink) reviewsLink.style.display = 'none';

            } else { // Assumes 'student' role
                document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
            }

            // Universal Logout Handler
            const logoutButton = document.getElementById('nav-logout-btn');
            if (logoutButton) {
                 logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('lmsToken');
                    localStorage.removeItem('lmsUser');
                    window.location.href = 'login.html';
                });
            }

        } else {
            // --- USER IS LOGGED OUT ---
            loginLink.classList.remove('d-none');
            userLink.classList.add('d-none');
        }
    };

    // Run the function to update the nav bar on page load
    updateNavDropdown();
});