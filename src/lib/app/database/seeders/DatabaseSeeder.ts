import { db } from '$lib/app/database';
import { user, product } from '$lib/app/database/schema';
import { hashPassword } from '$lib/app/server/auth';

export class DatabaseSeeder {

    static async seedUsers() {
        const existingUsers = await db.select().from(user).limit(1);

        if (existingUsers.length === 0) {
            const passwordHash = await hashPassword('password123');
            const users: typeof user.$inferInsert[] = [
                { id: crypto.randomUUID(), username: 'admin', email: 'admin@example.com', name: 'Admin User', age: 30, passwordHash },
                { id: crypto.randomUUID(), username: 'user1', email: 'user1@example.com', name: 'User One', age: 25, passwordHash },
                { id: crypto.randomUUID(), username: 'user2', email: 'user2@example.com', name: 'User Two', age: 28, passwordHash },
            ];
            await db.insert(user).values(users);
            return `Seeded ${users.length} users.`;
        }

        return "Users already seeded.";
    }

    static async seedProducts() {
        const existingProducts = await db.select().from(product).limit(1);

        if (existingProducts.length === 0) {
            const products: typeof product.$inferInsert[] = [
                { id: crypto.randomUUID(), name: 'Laptop Pro', category: 'Electronics', price: 1200, stock: 50 },
                { id: crypto.randomUUID(), name: 'Smartphone X', category: 'Electronics', price: 800, stock: 120 },
                { id: crypto.randomUUID(), name: 'Desk Chair', category: 'Furniture', price: 150, stock: 20 },
                { id: crypto.randomUUID(), name: 'Coffee Maker', category: 'Appliances', price: 80, stock: 45 },
                { id: crypto.randomUUID(), name: 'Running Shoes', category: 'Apparel', price: 100, stock: 200 },
                { id: crypto.randomUUID(), name: 'Wireless Headphones', category: 'Electronics', price: 200, stock: 85 },
                { id: crypto.randomUUID(), name: 'Notebook', category: 'Stationery', price: 5, stock: 500 },
            ];
            await db.insert(product).values(products);
            return `Seeded ${products.length} products.`;
        }

        return "Products already seeded.";
    }

    static async run() {
        const userMsg = await this.seedUsers();
        const prodMsg = await this.seedProducts();

        return {
            message: "Seeding complete",
            users: userMsg,
            products: prodMsg
        };
    }
}
