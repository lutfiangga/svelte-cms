import { db } from '$lib/app/database';
import { user } from '../models/user.schema';
import { eq, ilike, asc, desc, sql } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '$lib/app/server/auth';
import type { CreateUserDTO, UpdateUserDTO } from '../requests/user.request';
import type { UpdateProfileDTO, ChangePasswordDTO } from '../requests/profile.request';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export class UserService {

    // Helper: File Upload
    private static ensureUploadDir(dir: string) {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
    }

    private static async saveFile(file: File, relativePath = 'uploads/users'): Promise<string | null> {
        if (!file || file.size === 0) return null;

        const targetDir = join('static', relativePath);
        UserService.ensureUploadDir(targetDir);

        const ext = file.name.split('.').pop();
        const filename = `${crypto.randomUUID()}.${ext}`;
        const fullPath = join(targetDir, filename);
        const buffer = await file.arrayBuffer();
        writeFileSync(fullPath, Buffer.from(buffer));

        return `/${relativePath}/${filename}`;
    }

    private static deleteFile(path: string | null) {
        if (!path) return;
        const relativePath = path.startsWith('/') ? path.slice(1) : path;
        const fullPath = join('static', relativePath);
        if (existsSync(fullPath)) {
            try {
                unlinkSync(fullPath);
            } catch (e) {
                console.error(`Failed to delete file: ${fullPath}`, e);
            }
        }
    }

    static async getAll(params: {
        search?: string;
        page?: number;
        pageSize?: number;
        sort?: string;
        order?: string;
    }) {
        const { search, page = 1, pageSize = 10, sort = 'username', order = 'asc' } = params;
        const offset = (page - 1) * pageSize;

        // Where clause
        const whereClause = search ? ilike(user.username, `%${search}%`) : undefined;

        // Sort mapping
        const sortMap: Record<string, any> = {
            username: user.username,
            age: user.age,
            id: user.id
        };
        const sortCol = sortMap[sort] || user.username;
        const orderBy = order === 'asc' ? asc(sortCol) : desc(sortCol);

        const [users, totalResult] = await Promise.all([
            db.select().from(user).where(whereClause).orderBy(orderBy).limit(pageSize).offset(offset),
            db.select({ count: sql<number>`count(*)` }).from(user).where(whereClause)
        ]);

        return {
            users,
            total: Number(totalResult[0]?.count ?? 0)
        };
    }

    static async getById(id: string) {
        const [result] = await db.select().from(user).where(eq(user.id, id)).limit(1);
        return result;
    }

    static async create(data: CreateUserDTO) {
        const passwordHash = await hashPassword(data.password);

        await db.insert(user).values({
            id: crypto.randomUUID(),
            username: data.username,
            email: data.email || `${data.username}@example.com`,
            passwordHash: passwordHash,
            age: data.age ?? null
        });
    }

    static async update(data: UpdateUserDTO) {
        const updateData: Record<string, any> = {
            username: data.username,
            age: data.age ?? null
        };

        if (data.password) {
            updateData.passwordHash = await hashPassword(data.password);
        }

        await db.update(user).set(updateData).where(eq(user.id, data.id));
    }

    static async updateProfile(userId: string, data: UpdateProfileDTO) {
        const [existing] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
        if (!existing) throw new Error("User not found");

        const updateData: Record<string, any> = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.age !== undefined) updateData.age = data.age;

        // Handle photo upload
        if (data.photo && data.photo.size > 0 && data.photo.name !== 'undefined') {
            this.deleteFile(existing.photo);
            const photoPath = await this.saveFile(data.photo, data.photo_path);
            updateData.photo = photoPath;
        }

        await db.update(user).set(updateData).where(eq(user.id, userId));
    }

    static async changePassword(userId: string, data: ChangePasswordDTO) {
        const [existing] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
        if (!existing) throw new Error("User not found");

        // Verify current password
        const isValid = await verifyPassword(existing.passwordHash, data.currentPassword);
        if (!isValid) throw new Error("Current password is incorrect");

        // Update password
        const newPasswordHash = await hashPassword(data.newPassword);
        await db.update(user).set({ passwordHash: newPasswordHash }).where(eq(user.id, userId));
    }

    static async delete(id: string) {
        const [existing] = await db.select().from(user).where(eq(user.id, id)).limit(1);
        if (existing && existing.photo) {
            this.deleteFile(existing.photo);
        }
        await db.delete(user).where(eq(user.id, id));
    }

    static async bulkDelete(ids: string[]) {
        for (const id of ids) {
            await this.delete(id);
        }
    }
}
