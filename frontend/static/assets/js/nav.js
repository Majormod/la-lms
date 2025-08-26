document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('lmsToken');
    const userJSON = localStorage.getItem('lmsUser');
    let user = null;
    if (userJSON) {
        try { user = JSON.parse(userJSON); } catch (e) { console.error("Could not parse user data"); }
    }

    const loginLink = document.getElementById('nav-login-link');
    const userLink = document.getElementById('nav-user-link');

    if (token && user) {
        // --- USER IS LOGGED IN ---
        if (loginLink) loginLink.style.display = 'none';
        if (userLink) userLink.style.display = 'block';

        // Update name and avatar in the dropdown
        const userNameEl = document.getElementById('nav-user-name');
        const userNameDropdownEl = document.getElementById('nav-user-name-dropdown');
        const userAvatarEl = document.getElementById('nav-user-avatar');

        if (userNameEl) userNameEl.textContent = user.firstName || user.name.split(' ')[0];
        if (userNameDropdownEl) userNameDropdownEl.textContent = user.name || `${user.firstName} ${user.lastName}`;
        if (userAvatarEl && user.avatar) userAvatarEl.src = `/${user.avatar}`;

        // Configure links based on role
        const profileLink = document.querySelector('.rbt-admin-profile .rbt-btn-link');
        const settingsLinkInMenu = document.querySelector('a[href="instructor-settings.html"]'); // A selector for a settings link

        if (user.role === 'instructor') {
            if (profileLink) profileLink.href = 'instructor-profile.html';
            if (settingsLinkInMenu) settingsLinkInMenu.href = 'instructor-settings.html';
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'list-item');
        } else {
            if (profileLink) profileLink.href = 'student-profile.html';
            if (settingsLinkInMenu) settingsLinkInMenu.href = 'student-settings.html';
            document.querySelectorAll('.instructor-only-link').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.student-only-link').forEach(el => el.style.display = 'list-item');
        }

    } else {
        // --- USER IS LOGGED OUT ---
        if (loginLink) loginLink.style.display = 'block';
        if (userLink) userLink.style.display = 'none';
    }

    // Universal Logout Handler
    document.querySelectorAll('.logout-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('lmsToken');
            localStorage.removeItem('lmsUser');
            window.location.href = 'login.html';
        });
    });
});