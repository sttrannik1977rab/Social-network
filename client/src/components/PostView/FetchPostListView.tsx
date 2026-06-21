// import { useQuery } from "@tanstack/react-query";
// import { usePostList } from "../../api/Post"
// import { Loader } from "../Loader";
// import { PostListView } from "../PostListView/PostListView";

// export const FetchPostListView = () => {
//     // Реазируем хук usePostList
//     const { state, refetch } = usePostList();
//     // С помощью оператора switch-case отображаем, в зависимости от текущего состояния запроса,
//     // соответствующий компонент в пользовательском интерфейсе:
//     switch(state.status) {
//         case "idle":
//         case "pending":
//             return <Loader />;
//         case "success":
//             return <PostListView postList={state.data}/>;
//         case "error":
//             return (
//                 <div>
//                     <span>Произошла ошибка:</span>
//                     <button onClick={refetch}>Повторить запрос</button>
//                 </div>
//             )

    
//     }   
// }   
import { useQuery } from "@tanstack/react-query";
import { fetchPostList } from "../../api/Post"
import { Loader } from "../Loader";
import { PostListView } from "../PostListView/PostListView";
import { queryClient } from "../../api/QueryCient";

export const FetchPostListView = () => {
    
    const postListQuery = useQuery(
        {
            queryFn: () => fetchPostList(),
            queryKey: ["posts"],
        }, 
        queryClient
    );
    // С помощью оператора switch-case отображаем, в зависимости от текущего состояния запроса,
    // соответствующий компонент в пользовательском интерфейсе:
    switch(postListQuery.status) {
        case "pending":
            return <Loader />;
        case "success":
            return <PostListView postList={postListQuery.data.list}/>;
        case "error":
            return (
                <div>
                    <span>Произошла ошибка:</span>
                    <button onClick={(() => postListQuery.refetch())}>
                        Повторить запрос
                    </button>
                </div>
            )

    
    }   
}   