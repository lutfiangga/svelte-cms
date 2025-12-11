import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/app/server/auth';
import { db } from '$lib/app/database';
import { user as userTable } from '$lib/app/modules/user/models/user.schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		// Fetch complete user data from database
		const [fullUser] = await db
			.select({
				id: userTable.id,
				username: userTable.username,
				email: userTable.email,
				name: userTable.name,
				photo: userTable.photo,
				// age: userTable.age
			})
			.from(userTable)
			.where(eq(userTable.id, user.id))
			.limit(1);

		event.locals.user = fullUser || user;
		event.locals.session = session;
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	return resolve(event);
};
