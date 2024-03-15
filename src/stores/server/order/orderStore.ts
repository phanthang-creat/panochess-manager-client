import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import { PageOptionsType } from '~/types/metaType'
import { GetListOrdersQueryItemResponseDataType, GetOrderQueryItemResponseDataType, PatchOrderRequestBodyType, PostOrderRequestBodyType } from '~/types/order/orderType'


//GET /orders
const useGetOrderQuery = (pagination: PageOptionsType) => {
    return useQuery({
        queryKey: ['[GET] /orders'],
        queryFn: () => axios.get<GetListOrdersQueryItemResponseDataType>('/orders', { params: pagination }),
        select: (data) => data.data
    })
}

//GET /orders/{id}
const useGetOrderByIdQuery = (options: { id: string }) => {
    return useQuery({
        queryKey: ['[GET] /orders/', options.id],
        queryFn: () => axios.get<GetOrderQueryItemResponseDataType>(`/orders/${options.id}`),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

//POST /orders
const usePostOrderMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /orders'],
        mutationFn: (requestBody: PostOrderRequestBodyType) => axios.post('/orders', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /orders']
            })
    })
}

//PATCH /orders/{id}
const usePatchOrderMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /orders/{id}'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchOrderRequestBodyType }) =>
            axios.patch(`/orders/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /orders']
            })
    })
}

const useDeleteOrderMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /orders/{id}'],
        mutationFn: (id: string) => axios.delete(`/orders/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /orders']
            })
    })
}

export {
    useGetOrderQuery,
    useGetOrderByIdQuery,
    usePostOrderMutation,
    usePatchOrderMutation,
    useDeleteOrderMutation
}
