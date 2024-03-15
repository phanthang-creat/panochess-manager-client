import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'

import { GetListProductsQueryItemResponseDataType, GetProductQuery, GetProductQueryItemResponseDataType, PatchProductRequestBodyType, PostProductRequestBodyType } from '~/types/product/productType'

//GET /Products
const useGetProductQuery = (query?: GetProductQuery) => {
    return useQuery({
        queryKey: ['[GET] /products'],
        queryFn: () => axios.get<GetListProductsQueryItemResponseDataType>('/products', { params: query }),
        select: (data) => data.data
    })
}

//GET /Products/{id}
const useGetProductByIdQuery = (options: { id: string }) => {
    return useQuery({
        queryKey: ['[GET] /products/', options.id],
        queryFn: () => axios.get<GetProductQueryItemResponseDataType>(`/products/${options.id}`),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

//POST /Products
const usePostProductMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /products'],
        mutationFn: (requestBody: PostProductRequestBodyType) => axios.post('/products', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /products']
            })
    })
}

//PATCH /Products/{id}
const usePatchProductMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /products/{id}'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchProductRequestBodyType }) =>
            axios.patch(`/products/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /products']
            })
    })
}

const useDeleteProductMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /products/{id}'],
        mutationFn: (id: string) => axios.delete(`/products/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /products']
            })
    })
}

export {
    useGetProductQuery,
    useGetProductByIdQuery,
    usePostProductMutation,
    usePatchProductMutation,
    useDeleteProductMutation
}
