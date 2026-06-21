import { z } from 'zod';

// export interface User {
//     id: string;
//     username: string;
// }

export const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// Функция, которая получает
export function fetchUser(id: string): Promise<User> {
    return fetch(`/api/users/${id}`).
        then(response => response.json().
        then((data) => UserSchema.parse(data)));
}