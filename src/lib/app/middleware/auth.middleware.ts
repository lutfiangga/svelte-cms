import { redirect, type RequestEvent } from '@sveltejs/kit';

/**
 * Middleware to check if user is logged in
 * Redirects to login page if not authenticated
 */
export function isLogin(event: RequestEvent) {
    if (!event.locals.user) {
        redirect(302, '/login');
    }
    return {
        user: event.locals.user
    };
}

/**
 * Middleware to check if user is logged in and has specific role
 */
export function isLoginWithRole(event: RequestEvent, allowedRoles: string[]) {
    if (!event.locals.user) {
        redirect(302, '/login');
    }

    const userRole = event.locals.user.role;
    if (!allowedRoles.includes(userRole)) {
        redirect(302, '/unauthorized');
    }

    return {
        user: event.locals.user
    };
}

/**
 * Middleware to check if user is guest (not logged in)
 * Redirects to dashboard if already authenticated
 */
export function isGuest(event: RequestEvent) {
    if (event.locals.user) {
        redirect(302, '/dashboard');
    }
    return {};
}
