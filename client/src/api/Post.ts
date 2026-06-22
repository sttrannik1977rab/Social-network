import { useEffect, useState } from "react";
import { z } from "zod/v4-mini";
import { validateResponse } from "./validateResponse";


// export interface Post {
//     /**
//      * Индентификатор поста.
//      */
//     id: string;
//     text: string;
//     authorId: string;
//     createdAt: number;
// }

// export type PostList = [];

// // Функция, проверяющая на соответствие типам данных из Post
// function isPost(data: unknown): data is Post {
   
//     return (
//         typeof data === "object" && 
//         data !== null && 
//         "id" in data && 
//         typeof data.id === "string" &&
//         "text" in data &&
//         typeof data.text === "string" &&
//         "authorId" in data &&
//         typeof data.authorId === "string" &&
//         "createdAt" in data &&
//         typeof data.createdAt === "number"
//     );

export const PostSchema = z.object({
    id: z.string(),
    text: z.string(),
    authorId: z.string(),
    createdAt: z.number(),
});

export type Post = z.infer<typeof PostSchema>;

export const PostList = z.array(PostSchema);

export type PostList = z.infer<typeof PostList>;

// Схема для обработки ответа с сервера (объект с полем List, которое соответствует схеме PostList)
export const FetchPostListSchema = z.object({
    list: PostList,
});
// Выводим тип из этой схемы
export type  FetchPostListResponse = z.infer<typeof FetchPostListSchema>;

// Функция, которая получает список постов с сервера
export function fetchPostList(): Promise<FetchPostListResponse> {
    return fetch("/posts") // функция fetfch делает запрос к серверу
        .then(response => response.json()) // преобразует ответ в формат json
        .then((data) => FetchPostListSchema.parse(data)); // валидирует, проверяет ответ на соответствие c описанной выше схемой
}

// Для того, чтобы получать список постов в React-компоненте, реализуем хук usePostList().
// Этот хук будет работать с состояниями, поэтому сначала опишем эти состояния в виде интерфейсов:
// - начальное состояние, в котором запрос еще не отправлен:
interface IdleRequeststate {
    status: "idle";    
}
// - состояние загрузки:
interface LoadingRequeststate {
    status: "pending";
}
// - состояние успешного завершения:
interface SuccessRequeststate {
    status: "success";
    data: PostList;
}
// - состояние ошибки:
interface ErrorRequeststate {
    status: "error";
    error: unknown;
}
// Объединяем эти типы в один (представляет собой состояние запроса):
type RequestState = | IdleRequeststate 
                    | LoadingRequeststate 
                    | SuccessRequeststate 
                    | ErrorRequeststate;

export function usePostList() { 
    const [state, setState] = useState<RequestState>({ status: "idle" });
    // Отправка запроса - это побочный эффект, поэтому его нужно производить внутри хука UseEffect()
    useEffect(() => { 
        if (state.status === "pending") { // (запрос производится в состоянии загрузки)
            // Для получения данных воспользуемся функцией
            fetchPostList()
                .then((data) => { 
                    setState({ status: "success", data: data.list }); // в результате успешного выполнения запроса, переводим  хук в состояние success 
                    // и устанавливаем текущие данные (список постов в ответе от сервера находится в поле list)
                })
                .catch((error) => {
                    setState({ status: "error", error})
                })
        }
        
    }, [state]);
    // Загрузку данных удобно производить при монтировании компоннта
    useEffect(() => {
        setState({ status: "pending"}); // переводим хук в состоянии загрузки
    }, []);
    // Реализуем функцию, которая будет повторять запрос в случае устаривании данных или ошибки
    const refetch = () => {
        setState({ status: "pending"}); // переводим хук в состоянии загрузки
    }

    return {
        state, // возвращаем из хука текущее состояние
        refetch, //возвращаем функцию посторения запроса 
    }
}

// Функция создания постов
export function createPost(text: string): Promise<void> {
    return fetch("/api/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
        }),
    }).then(validateResponse).then(() => undefined);
}

