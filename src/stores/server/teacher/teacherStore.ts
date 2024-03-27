import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetListTeachersQueryItemResponseDataType, GetTeacherQueryItemResponseDataType, PatchTeacherRequestBodyType, PostTeacherRequestBodyType } from "~/types/teachers/teacherType"

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

const useGetTeacherByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['[GET] /teacher', id],
        queryFn: () => axios.get<
            GetTeacherQueryItemResponseDataType
        >(`/teacher/${id}`),
        select: (data) => data.data
    })
}

const useGetTeacherBasicInfoByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['[GET] /teacher/basic', id],
        queryFn: () => axios.get<
            GetTeacherQueryItemResponseDataType
        >(`/teacher/basic/${id}`),
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

const usePatchTeacherMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /teacher'],
        mutationFn: ({ id, data }: { id: string; data: PatchTeacherRequestBodyType }) => axios.patch(`/teacher/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['[GET] /teacher'] })
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
    useGetTeacherByIdQuery,
    useGetTeacherBasicInfoByIdQuery,
    usePostTeacherMutation,
    usePatchTeacherMutation
}