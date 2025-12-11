
import type { FormSchema } from '$lib/types/form-builder';

export const createUserSchema: FormSchema = [
    {
        type: 'grid',
        columns: 1,
        children: [
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'age', label: 'Age', type: 'number' },
            { name: 'password', label: 'Password', type: 'password', required: true }
        ]
    }
];

export const editUserSchema: FormSchema = [
    {
        type: 'grid',
        columns: 1,
        children: [
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'age', label: 'Age', type: 'number' },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                placeholder: '(Unchanged)',
                description: 'Leave blank to keep current password.'
            }
        ]
    }
];
