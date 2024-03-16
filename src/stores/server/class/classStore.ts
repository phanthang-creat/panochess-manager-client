import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs";
import { GetClassQueryItemResponseDataType, PatchClassRequestBodyType, PostClassRequestBodyType } from "~/types/class/classType";

//GET /class
const useGetClassesQuery = () => {
    return useQuery({
        queryKey: ['[GET] /class'],
        queryFn: () => axios.get<Array<GetClassQueryItemResponseDataType>>('/class'),
        select: (data) => data.data
    })
}

//GET /class/{id}
const useGetClassByIdQuery = (
    options: {id: string}
) => {
    return useQuery({
        queryKey: ['[GET] /class/', options.id],
        queryFn: () => axios.get(`/class/${options.id}`),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

//POST /class
const usePostClassMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /class'],
        mutationFn: (requestBody: PostClassRequestBodyType) => axios.post('/class', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /class']
            })
    })
}

//PATCH /class/{id}
const usePatchClassMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /class/{id}'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchClassRequestBodyType }) =>
            axios.patch(`/class/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /class']
            })
    })
}

const useDeleteClassMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /class/{id}'],
        mutationFn: (id: string) => axios.delete(`/class/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /class']
            })
    })
}

export { 
    useGetClassesQuery,
    useGetClassByIdQuery,
    usePostClassMutation,
    usePatchClassMutation,
    useDeleteClassMutation
}