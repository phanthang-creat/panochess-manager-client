import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetStudentQueryItemResponseDataType, PatchStudentRequestBodyType, PostStudentRequestBodyType, QueryGetStudentType, StudentResponseDataType } from "~/types/students/studentType"

// GET /students
const useGetStudentsQuery = (query?: QueryGetStudentType) => {
    return useQuery({
        queryKey: ['[GET] /students', query],
        queryFn: () => axios.get<
            GetStudentQueryItemResponseDataType
        >('/students'),
        select: (data) => data.data
    })
}

// GET /students
const useGetStudentTimeSlotsQuery = (query?: QueryGetStudentType) => {
    return useQuery({
        queryKey: ['[GET] /students/time-slot'],
        queryFn: () => axios.get<
            GetStudentQueryItemResponseDataType
        >('/students/time-slot', { params: query }),
        select: (data) => data.data
    })
}

const useGetStudentByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['[GET] /students', id],
        queryFn: () => axios.get<
            StudentResponseDataType
        >(`/students/${id}`),
        enabled: !!id,
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
    useGetStudentTimeSlotsQuery,
    useGetStudentByIdQuery,
    usePostStudentMutation,
    usePatchStudentMutation
}