import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs";
import { GetListClassStudentQueryResponseDataType, PostClassStudentRequestBodyDataType, QueryClassStudentDataType } from "~/types/class/classStudentType";

//GET /class-students
const useGetClassStudentsQuery = (query?: QueryClassStudentDataType) => {
    return useQuery({
        queryKey: ['[GET] /class-students'],
        queryFn: () => axios.get<GetListClassStudentQueryResponseDataType>('/class-students', { params: query }),
        select: (data) => data.data
    })
}

//GET /class-students/{id}
// const useGetClassByIdQuery = (
//     options: {id: string}
// ) => {
//     return useQuery({
//         queryKey: ['[GET] /class-students/', options.id],
//         queryFn: () => axios.get(`/class-students/${options.id}`),
//         select: (data) => data.data,
//         enabled: !!options.id,
//         retry: 3
//     })
// }

//POST /class-students
const usePostClassStudentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /class-students'],
        mutationFn: (requestBody: PostClassStudentRequestBodyDataType) => axios.post('/class-students', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /class-students']
            })
    })
}

//PATCH /class-students/{id}
// const usePatchClassMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationKey: ['[PATCH] /class-students/{id}'],
//         mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchClassRequestBodyType }) =>
//             axios.patch(`/class-students/${id}`, requestBody),
//         onSuccess: () =>
//             queryClient.invalidateQueries({
//                 queryKey: ['[GET] /class-students']
//             })
//     })
// }

const useDeleteClassStudentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /class-students/{id}'],
        mutationFn: (id: string) => axios.delete(`/class-students/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /class-students']
            })
    })
}

export { 
    useGetClassStudentsQuery,
    // useGetClassByIdQuery,
    usePostClassStudentMutation,
    // usePatchClassMutation,
    useDeleteClassStudentMutation
}