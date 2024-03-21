import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs";
import { GetTimeSlotQueryItemResponseDataType, PatchTimeSlotRequestBodyType, PostTimeSlotRequestBodyType } from "~/types/timeSlot/timeSlotType";

//GET /time-slots
const useGetTimeSlotsQuery = () => {
    return useQuery({
        queryKey: ['[GET] /time-slots'],
        queryFn: () => axios.get<Array<GetTimeSlotQueryItemResponseDataType>>('/time-slots'),
        select: (data) => data.data
    })
}

//GET /time-slots/{id}
const useGetTimeSlotByIdQuery = (
    options: {id: string}
) => {
    return useQuery({
        queryKey: ['[GET] /time-slots/', options.id],
        queryFn: () => axios.get(`/time-slots/${options.id}`),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

//POST /time-slots
const usePostTimeSlotMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /time-slots'],
        mutationFn: (requestBody: PostTimeSlotRequestBodyType) => axios.post('/time-slots', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /time-slots']
            })
    })
}

//PATCH /time-slots/{id}
const usePatchTimeSlotMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /time-slots/{id}'],
        mutationFn: ({ id, requestBody }: { id: number; requestBody: PatchTimeSlotRequestBodyType }) =>
            axios.patch(`/time-slots/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /time-slots']
            })
    })
}

const useDeleteTimeSlotMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /time-slots/{id}'],
        mutationFn: (id: number) => axios.delete(`/time-slots/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /time-slots']
            })
    })
}

export { 
    useGetTimeSlotsQuery,
    useGetTimeSlotByIdQuery,
    usePostTimeSlotMutation,
    usePatchTimeSlotMutation,
    useDeleteTimeSlotMutation
}