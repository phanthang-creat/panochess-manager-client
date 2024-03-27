import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetBranchQueryItemResponseDataType, PatchBranchRequestBodyType, PostBranchRequestBodyType } from "~/types/branchType"

const useGetBranchQuery = () => {
    return useQuery({
        queryKey: ['[GET] /branches/'],
        queryFn: () => axios.get<
            Array<GetBranchQueryItemResponseDataType>
        >(`/branches`),
        select: (data) => data.data.filter((item) => item.id !== 1),
        retry: 3
    })
}


const usePostBranchMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /branches'],
        mutationFn: (requestBody: PostBranchRequestBodyType) => axios.post('/branches', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /branches']
            })
    })
}

const usePatchBranchMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /branches'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchBranchRequestBodyType }) => axios.patch(`/branches/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /branches']
            })
    })
}

export {
    useGetBranchQuery,
    usePostBranchMutation,
    usePatchBranchMutation
}