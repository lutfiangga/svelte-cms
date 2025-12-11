import { db } from '$lib/app/database';
import { category } from '../models/category.schema';
import { eq, desc } from 'drizzle-orm';
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../requests/category.request';

export class CategoryService {

    static async getAll() {
        return await db.select().from(category).orderBy(desc(category.createdAt));
    }

    static async create(data: CreateCategoryDTO) {
        await db.insert(category).values({
            id: crypto.randomUUID(),
            name: data.name,
            description: data.description,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    static async update(data: UpdateCategoryDTO) {
        await db.update(category)
            .set({
                name: data.name,
                description: data.description,
                updatedAt: new Date()
            })
            .where(eq(category.id, data.id));
    }

    static async delete(id: string) {
        await db.delete(category).where(eq(category.id, id));
    }

    static async bulkDelete(ids: string[]) {
        for (const id of ids) {
            await this.delete(id);
        }
    }
}
