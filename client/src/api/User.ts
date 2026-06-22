import { z } from 'zod';
import { validateResponse } from './validateResponse';

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

// Функция регистрации пользователя
export function registerUser(
    username: string, 
    password: string
): Promise<void> {
    return fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
    }).then(() => undefined);
}

// Функция для входа зарегистрированного пользователя
export function login(
    username: string, 
    password: string
): Promise<void> {
    return fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
        .then(validateResponse)
        .then(() => undefined);
}

// Для решения задачи по проверки авторизованности пользователя на сервере реализован метод, 
// позволяющий получить самого себя. Для того, чтобы воспользоваться этим методом, реализуем следующую функцию:
export function fetchMe(): Promise<User>{
    return fetch("/api/users/me")
        .then(validateResponse)
        .then(response => response.json())
        .then(data => UserSchema.parse(data));
}