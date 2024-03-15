import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetStudentQueryItemResponseDataType, PatchStudentRequestBodyType, PostStudentRequestBodyType, StudentResponseDataType } from "~/types/students/studentType"

// GET /students
const useGetStudentsQuery = () => {
    return useQuery({
        queryKey: ['[GET] /students'],
        queryFn: () => axios.get<
            GetStudentQueryItemResponseDataType
        >('/students'),
        select: (data) => data.data
    })
}

const useGetStudentByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['[GET] /students', id],
        queryFn: () => axios.get<
            StudentResponseDataType
        >(`/students/${id}`),
        select: (data) => data.data
    })
}

const usePostStudentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /students'],
        mutationFn: (data: PostStudentRequestBodyType) => axios.post('/students', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['[GET] /students'] })
        }
    })

}

const usePatchStudentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /students'],
        mutationFn: ({ id, data }: { id: string; data: PatchStudentRequestBodyType }) => axios.patch(`/students/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['[GET] /students'] })
        }
    })
}

// const useDeleteStudentQuery = () => {
//     return useQuery({
//         queryKey: ['[DELETE] /students'],
//         queryFn: () => axios.delete('/students'),
//         select: (data) => data.data
//     })
// }

export {
    useGetStudentsQuery,
    useGetStudentByIdQuery,
    usePostStudentMutation,
    usePatchStudentMutation
}