export const adminAuth = {
    // Check if user is logged in as admin
    isAdmin(): boolean {
        return localStorage.getItem('orbact_admin_session') === 'true';
    },

    // Login as admin with password
    login(password: string): boolean {
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (!correctPassword) {
            console.error('Admin password not configured in environment variables');
            return false;
        }

        if (password === correctPassword) {
            localStorage.setItem('orbact_admin_session', 'true');
            return true;
        }
        return false;
    },

    // Logout from admin
    logout(): void {
        localStorage.removeItem('orbact_admin_session');
    },

    // Get admin password from environment (for comparison)
    getAdminPassword(): string | undefined {
        return import.meta.env.VITE_ADMIN_PASSWORD;
    }
};
