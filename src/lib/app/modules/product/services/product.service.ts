import { db } from '$lib/app/database';
import { product } from '../models/product.schema';
import { eq, desc } from 'drizzle-orm';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { CreateProductDTO, UpdateProductDTO } from '../requests/product.request';

export class ProductService {

    // Helper: File Upload
    private static ensureUploadDir(dir: string) {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
    }

    private static async saveFile(file: File, relativePath = 'uploads/products'): Promise<string | null> {
        if (!file || file.size === 0) return null;

        const targetDir = join('static', relativePath);
        ProductService.ensureUploadDir(targetDir);

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

    // CRUD Methods
    static async getAll() {
        const { category } = await import('$lib/app/modules/category/models/category.schema');

        return await db
            .select({
                id: product.id,
                name: product.name,
                categoryId: product.categoryId,
                categoryName: category.name,
                price: product.price,
                stock: product.stock,
                images: product.images,
                updatedAt: product.updatedAt
            })
            .from(product)
            .leftJoin(category, eq(product.categoryId, category.id))
            .orderBy(desc(product.updatedAt));
    }

    static async create(data: CreateProductDTO) {
        let imagePaths: string[] = [];
        if (data.images && data.images.length > 0) {
            for (const file of data.images) {
                const path = await this.saveFile(file, data.image_path);
                if (path) imagePaths.push(path);
            }
        }

        await db.insert(product).values({
            id: crypto.randomUUID(),
            name: data.name,
            categoryId: data.categoryId,
            price: data.price,
            stock: data.stock,
            images: imagePaths,
            updatedAt: new Date()
        });
    }

    static async update(data: UpdateProductDTO) {
        const [existing] = await db.select().from(product).where(eq(product.id, data.id)).limit(1);
        if (!existing) throw new Error("Product not found");

        // Start with existing images to keep (from form hidden inputs)
        let imagePaths: string[] = data.images_existing || [];

        // Delete removed images (files and from list)
        if (data.images_deleted && data.images_deleted.length > 0) {
            for (const deletedPath of data.images_deleted) {
                this.deleteFile(deletedPath);
            }
        }

        // Upload new images and add to list
        if (data.images && data.images.length > 0) {
            for (const file of data.images) {
                const path = await this.saveFile(file, data.image_path);
                if (path) imagePaths.push(path);
            }
        }

        await db.update(product)
            .set({
                name: data.name,
                categoryId: data.categoryId,
                price: data.price,
                stock: data.stock,
                images: imagePaths,
                updatedAt: new Date()
            })
            .where(eq(product.id, data.id));
    }

    static async delete(id: string) {
        const [existing] = await db.select().from(product).where(eq(product.id, id)).limit(1);
        if (existing && existing.images && Array.isArray(existing.images)) {
            for (const img of existing.images) {
                this.deleteFile(img);
            }
        }
        await db.delete(product).where(eq(product.id, id));
    }

    static async bulkDelete(ids: string[]) {
        for (const id of ids) {
            await this.delete(id);
        }
    }
}
