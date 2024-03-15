import {
    // useMutation,
    useQuery,
    // useQueryClient 
} from '@tanstack/react-query'
import { axios } from '~/configs'
import { GetOrderStatusQueryItemResponseDataType } from '~/types/order/orderStatusType'


//GET /order-statuses
const useGetOrderStatusesQuery = () => {
    return useQuery({
        queryKey: ['[GET] /order-statuses'],
        queryFn: () => axios.get<Array<GetOrderStatusQueryItemResponseDataType>>('/order-statuses'),
        select: (data) => data.data
    })
}

//GET /order-statuses/{id}
// const useGetOrderByIdQuery = (options: { id: string }) => {
//     return useQuery({
//         queryKey: ['[GET] /order-statuses/', options.id],
//         queryFn: () => axios.get<GetOrderQueryItemResponseDataType>(`/order-statuses/${options.id}`),
//         select: (data) => data.data,
//         enabled: !!options.id,
//         retry: 3
//     })
// }

// //POST /order-statuses
// const usePostOrderMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationKey: ['[POST] /order-statuses'],
//         mutationFn: (requestBody: PostOrderRequestBodyType) => axios.post('/order-statuses', requestBody),
//         onSuccess: () =>
//             queryClient.invalidateQueries({
//                 queryKey: ['[GET] /order-statuses']
//             })
//     })
// }

// //PATCH /order-statuses/{id}
// const usePatchOrderMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationKey: ['[PATCH] /order-statuses/{id}'],
//         mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchOrderRequestBodyType }) =>
//             axios.patch(`/order-statuses/${id}`, requestBody),
//         onSuccess: () =>
//             queryClient.invalidateQueries({
//                 queryKey: ['[GET] /order-statuses']
//             })
//     })
// }

// const useDeleteOrderMutation = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationKey: ['[DELETE] /order-statuses/{id}'],
//         mutationFn: (id: string) => axios.delete(`/order-statuses/${id}`),
//         onSuccess: () =>
//             queryClient.invalidateQueries({
//                 queryKey: ['[GET] /order-statuses']
//             })
//     })
// }

export {
    useGetOrderStatusesQuery,
    // useGetOrderByIdQuery,
    // usePostOrderMutation,
    // usePatchOrderMutation,
    // useDeleteOrderMutation
}
