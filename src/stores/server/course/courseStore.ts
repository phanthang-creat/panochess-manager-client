import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "~/configs";
import { GetCourseResponseDataType, PatchCourseRequestBodyType, PostCourseRequestBodyType } from "~/types/course/courseType";

//GET /courses
const useGetCoursesQuery = () => {
    return useQuery({
        queryKey: ['[GET] /courses'],
        queryFn: () => axios.get<Array<GetCourseResponseDataType>>('/courses'),
        select: (data) => data.data
    })
}

//GET /courses/{id}
const useGetCourseByIdQuery = (
    options: {id: string}
) => {
    return useQuery({
        queryKey: ['[GET] /courses/', options.id],
        queryFn: () => axios.get(`/courses/${options.id}`),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

//POST /courses
const usePostCourseMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /courses'],
        mutationFn: (requestBody: PostCourseRequestBodyType) => axios.post('/courses', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /courses']
            })
    })
}

//PATCH /courses/{id}
const usePatchCourseMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /courses/{id}'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchCourseRequestBodyType }) =>
            axios.patch(`/courses/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /courses']
            })
    })
}

const useDeleteCourseMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /courses/{id}'],
        mutationFn: (id: string) => axios.delete(`/courses/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /courses']
            })
    })
}

export { 
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    usePostCourseMutation,
    usePatchCourseMutation,
    useDeleteCourseMutation
}