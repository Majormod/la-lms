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

    // Define the menu links for each role
    const instructorLinks = [
        { href: 'instructor-dashboard.html', icon: 'home', text: 'My Dashboard' },
        { href: 'instructor-profile.html', icon: 'user', text: 'My Profile' },
        { href: 'instructor-my-courses.html', icon: 'book-open', text: 'My Courses' },
        { href: 'instructor-announcements.html', icon: 'volume-2', text: 'Announcements' },
        { href: 'instructor-quiz-attempts.html', icon: 'help-circle', text: 'Quiz Attempts' },
        { href: 'instructor-assignments.html', icon: 'file-text', text: 'Assignments' }
    ];

    const studentLinks = [
        { href: 'student-dashboard.html', icon: 'home', text: 'My Dashboard' },
        { href: 'student-profile.html', icon: 'user', text: 'My Profile' },
        { href: 'student-enrolled-courses.html', icon: 'book-open', text: 'Enrolled Courses' },
        { href: 'student-my-quiz-attempts.html', icon: 'help-circle', text: 'My Quiz Attempts' },
        { href: 'student-order-history.html', icon: 'shopping-bag', text: 'Order History' },
        { href: 'student-reviews.html', icon: 'star', text: 'Reviews' },
        { href: 'student-wishlist.html', icon: 'bookmark', text: 'Wishlist' }
    ];

    const loginLink = document.getElementById('nav-login-link');
    const userLink = document.getElementById('nav-user-link'); // Desktop user display
    const userWrappers = document.querySelectorAll('.rbt-user-wrapper'); // All dropdown wrappers

    if (token && user) {
        // --- 1. USER IS LOGGED IN ---

        // Hide the main login link and show the user dropdowns
        if (loginLink) loginLink.classList.add('d-none');
        if (userLink) userLink.classList.remove('d-none');
        userWrappers.forEach(wrapper => wrapper.classList.remove('d-none'));

        // Populate user name in all relevant places
        const fullName = user.name || `${user.firstName} ${user.lastName}`;
        document.querySelectorAll('#nav-user-name, #nav-user-name-dropdown, .rbt-admin-profile .admin-info .name').forEach(el => {
            if (el) el.textContent = fullName;
        });

        // Populate user avatar in all relevant places
        if (user.avatar) {
            const avatarPath = `/${user.avatar.replace(/\\/g, '/')}`;
            document.querySelectorAll('#nav-user-avatar, .rbt-user-wrapper .admin-thumbnail img').forEach(img => {
                if (img) img.src = avatarPath;
            });
        }
        
        // Determine which links to show and their destinations
        const linksToShow = user.role === 'instructor' ? instructorLinks : studentLinks;
        const profileUrl = user.role === 'instructor' ? 'instructor-profile.html' : 'profile.html';
        const settingsUrl = user.role === 'instructor' ? 'instructor-settings.html' : 'student-settings.html';
        
        // Update the "View Profile" links
        document.querySelectorAll('.rbt-admin-profile .rbt-btn-link').forEach(a => a.href = profileUrl);

        // Dynamically build the menu to ensure it's correct for the role
        const menuHtml = linksToShow.map(link => `<li><a href="${link.href}"><i class="feather-${link.icon}"></i><span>${link.text}</span></a></li>`).join('');
        
        // Update all user menu lists with the correct links
        document.querySelectorAll('.rbt-user-menu-list-wrapper ul.user-list-wrapper').forEach((ul, index) => {
            // Target the main list of links, not the settings/logout list
            if (ul.parentElement.classList.contains('inner')) {
                ul.innerHTML = menuHtml;
            }
        });

        // Update settings and logout links specifically
        document.querySelectorAll('a[href*="settings.html"]').forEach(a => a.href = settingsUrl);
        
    } else {
        // --- 2. USER IS LOGGED OUT ---
        if (loginLink) loginLink.classList.remove('d-none');
        if (userLink) userLink.classList.add('d-none');
        // Hide the dropdown menu wrappers for logged out users
        userWrappers.forEach(wrapper => wrapper.style.display = 'none');
    }

    // --- 3. UNIVERSAL LOGOUT HANDLER ---
    document.querySelectorAll('.logout-btn, a[href="index.html"] > i.feather-log-out').forEach(button => {
        const link = button.closest('a');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('lmsToken');
                localStorage.removeItem('lmsUser');
                window.location.href = 'login.html';
            });
        }
    });
});