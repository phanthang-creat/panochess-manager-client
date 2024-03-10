import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs"
import { PatchStudentRequestBodyType, StudentResponseDataType } from "~/types/students/studentType"
import { GetListTeachersQueryItemResponseDataType, PostTeacherRequestBodyType } from "~/types/teachers/teacherType"

// GET /students
const useGetTeachersQuery = () => {
    return useQuery({
        queryKey: ['[GET] /teacher'],
        queryFn: () => axios.get<
            GetListTeachersQueryItemResponseDataType
        >('/teacher'),
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

const usePostTeacherMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /teacher'],
        mutationFn: (data: PostTeacherRequestBodyType) => axios.post('/teacher', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['[GET] /teacher'] })
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
    useGetTeachersQuery,
    useGetStudentByIdQuery,
    usePostTeacherMutation,
    usePatchStudentMutation
}