nav.js (12:11am 26th):

document.addEventListener('DOMContentLoaded', () => {

const updateNavDropdown = () => {
    const token = localStorage.getItem('lmsToken');

    const loginLink = document.getElementById('nav-login-link');
    const userLink = document.getElementById('nav-user-link');
    const userMenu = document.querySelector('.rbt-user-menu-list-wrapper');

    if (!loginLink || !userLink || !userMenu) {
        console.error('Navigation elements not found. Cannot update dropdown.');
        return;
    }

    if (token && user) {
        // --- USER IS LOGGED IN ---
        loginLink.classList.add('d-none');
        userLink.classList.remove('d-none');
        userMenu.style.display = '';

        document.getElementById('nav-user-name').textContent = user.name.split(' ')[0];
        document.getElementById('nav-user-name-dropdown').textContent = user.name;
        
        fetch('/api/user/profile', { headers: { 'x-auth-token': token } })
        .then(res => res.json())
        .then(result => {
            if (result.success && result.data.avatar) {
                document.getElementById('nav-user-avatar').src = `/${result.data.avatar}`;
            }
        });

        if (user.role === 'instructor') {
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
            
            // --- NEW: Hide Bookmark and Reviews for Instructors ---
            document.getElementById('nav-bookmark-link').style.display = 'none';
            document.getElementById('nav-reviews-link').style.display = 'none';

        } else { // Assumes 'student' role
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

        document.getElementById('nav-logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('lmsToken');
            localStorage.removeItem('lmsUser');
            window.location.href = '/login.html';
        });

    } else {
        // --- USER IS LOGGED OUT ---
        loginLink.classList.remove('d-none');
        userLink.classList.add('d-none');
        userMenu.style.display = 'none';
    }
};

    updateNavDropdown();
});