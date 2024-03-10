import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs";
import { GetAccountQueryItemResponseDataType, PatchAccountRequestBodyType, PostAccountRequestBodyType } from "~/types/accountType";

//GET /accounts
const useGetAccountsQuery = () => {
    return useQuery({
        queryKey: ['[GET] /accounts'],
        queryFn: () => axios.get<
            Array<GetAccountQueryItemResponseDataType>
        >('/accounts'),
        select: (data) => data.data
    })
}

//GET /accounts/{id}
const useGetAccountByIdQuery = (
    options: {id: string}
) => {
    return useQuery({
        queryKey: ['[GET] /accounts/', options.id],
        queryFn: () => axios.get<GetAccountQueryItemResponseDataType>(`/accounts/${options.id}`),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

//POST /accounts
const usePostAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /accounts'],
        mutationFn: (requestBody: PostAccountRequestBodyType) => axios.post('/accounts', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /accounts']
            })
    })
}

//PATCH /accounts/{id}
const usePatchAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /accounts/{id}'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchAccountRequestBodyType }) =>
            axios.patch(`/accounts/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /accounts']
            })
    })
}

export {
    useGetAccountsQuery,
    useGetAccountByIdQuery,
    usePostAccountMutation,
    usePatchAccountMutation
}