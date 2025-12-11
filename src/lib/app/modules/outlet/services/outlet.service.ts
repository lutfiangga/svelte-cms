import { db } from '$lib/app/database';
import { outlet } from '../models/outlet.schema';
import { eq, desc } from 'drizzle-orm';
import type { CreateOutletDTO, UpdateOutletDTO } from '../requests/outlet.request';

export class OutletService {

    static async getAll() {
        return await db.select().from(outlet).orderBy(desc(outlet.createdAt));
    }

    static async create(data: CreateOutletDTO) {
        await db.insert(outlet).values({
            id: crypto.randomUUID(),
            name: data.name,
            address: data.address,
            province: data.province,
            city: data.city,
            district: data.district,
            latitude: data.latitude,
            longitude: data.longitude,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    static async update(data: UpdateOutletDTO) {
        await db.update(outlet)
            .set({
                name: data.name,
                address: data.address,
                province: data.province,
                city: data.city,
                district: data.district,
                latitude: data.latitude,
                longitude: data.longitude,
                updatedAt: new Date()
            })
            .where(eq(outlet.id, data.id));
    }

    static async delete(id: string) {
        await db.delete(outlet).where(eq(outlet.id, id));
    }

    static async bulkDelete(ids: string[]) {
        for (const id of ids) {
            await this.delete(id);
        }
    }
}
