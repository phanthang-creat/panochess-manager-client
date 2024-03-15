import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs";
import { GetClassroomQueryItemResponseDataType, PatchClassroomRequestBodyType, PostClassroomRequestBodyType } from "~/types/classroom/classroomType";

//GET /classroom
const useGetClassroomsQuery = () => {
    return useQuery({
        queryKey: ['[GET] /classroom'],
        queryFn: () => axios.get<Array<GetClassroomQueryItemResponseDataType>>('/classroom'),
        select: (data) => data.data
    })
}

//GET /classroom/{id}
const useGetClassroomByIdQuery = (
    options: {id: string}
) => {
    return useQuery({
        queryKey: ['[GET] /classroom/', options.id],
        queryFn: () => axios.get(`/classroom/${options.id}`),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

//POST /classroom
const usePostClassroomMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /classroom'],
        mutationFn: (requestBody: PostClassroomRequestBodyType) => axios.post('/classroom', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /classroom']
            })
    })
}

//PATCH /classroom/{id}
const usePatchClassroomMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /classroom/{id}'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchClassroomRequestBodyType }) =>
            axios.patch(`/classroom/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /classroom']
            })
    })
}

const useDeleteClassroomMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /classroom/{id}'],
        mutationFn: (id: string) => axios.delete(`/classroom/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /classroom']
            })
    })
}

export { 
    useGetClassroomsQuery,
    useGetClassroomByIdQuery,
    usePostClassroomMutation,
    usePatchClassroomMutation,
    useDeleteClassroomMutation
}