import {
    useMutation,
    // useMutation,
    useQuery,
    useQueryClient,
    // useQueryClient
} from "@tanstack/react-query"
import { axios } from "~/configs";
import { GetClassSampleQueryItemResponse, PostClassSampleRequestBodyType } from "~/types/class/classSampleType";

//GET /class
const useGetClassSampleQuery = () => {
    return useQuery({
        queryKey: ['[GET] /class-sample'],
        queryFn: () => axios.get<Array<GetClassSampleQueryItemResponse>>('/class-sample'),
        select: (data) => data.data
    })
}

//GET /class/{id}
// const useGetClassByIdQuery = (
//     options: {id: string}
// ) => {
//     return useQuery({
//         queryKey: ['[GET] /class/', options.id],
//         queryFn: () => axios.get(`/class/${options.id}`),
//         select: (data) => data.data,
//         enabled: !!options.id,
//         retry: 3
//     })
// }

//POST /class-sample
const usePostClassSampleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /class-sample'],
        mutationFn: (requestBody: PostClassSampleRequestBodyType[]) => axios.post('/class-sample', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /class-sample']
            })
    })
}

// //PATCH /class/{id}
// const usePatchClassMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationKey: ['[PATCH] /class/{id}'],
//         mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchClassRequestBodyType }) =>
//             axios.patch(`/class/${id}`, requestBody),
//         onSuccess: () =>
//             queryClient.invalidateQueries({
//                 queryKey: ['[GET] /class']
//             })
//     })
// }

// const useDeleteClassMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationKey: ['[DELETE] /class/{id}'],
//         mutationFn: (id: string) => axios.delete(`/class/${id}`),
//         onSuccess: () =>
//             queryClient.invalidateQueries({
//                 queryKey: ['[GET] /class']
//             })
//     })
// }

export { 
    useGetClassSampleQuery,
    usePostClassSampleMutation,
    // usePostClassMutation,
    // usePatchClassMutation,
    // useDeleteClassMutation
}