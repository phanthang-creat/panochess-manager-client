import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/configs'
import {
    PostProductCategoryRequestBodyType,
    GetProductCategoryQueryItemResponseDataType,
    PatchProductCategoryRequestBodyType
} from '~/types/product-categories/productCategoryType'

//GET /ProductCategories
const useGetProductCategoriesQuery = () => {
    return useQuery({
        queryKey: ['[GET] /product-categories'],
        queryFn: () => axios.get<Array<GetProductCategoryQueryItemResponseDataType>>('/product-categories'),
        select: (data) => data.data
    })
}

//GET /ProductCategories/{id}
const useGetProductCategoryByIdQuery = (options: { id: string }) => {
    return useQuery({
        queryKey: ['[GET] /product-categories/', options.id],
        queryFn: () => axios.get(`/product-categories/${options.id}`),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

//POST /ProductCategories
const usePostProductCategoryMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /product-categories'],
        mutationFn: (requestBody: PostProductCategoryRequestBodyType) => axios.post('/product-categories', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /product-categories']
            })
    })
}

//PATCH /ProductCategories/{id}
const usePatchProductCategoryMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /product-categories/{id}'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchProductCategoryRequestBodyType }) =>
            axios.patch(`/product-categories/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /product-categories']
            })
    })
}

const useDeleteProductCategoryMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /product-categories/{id}'],
        mutationFn: (id: string) => axios.delete(`/product-categories/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /product-categories']
            })
    })
}

export {
    useGetProductCategoriesQuery,
    useGetProductCategoryByIdQuery,
    usePostProductCategoryMutation,
    usePatchProductCategoryMutation,
    useDeleteProductCategoryMutation
}
