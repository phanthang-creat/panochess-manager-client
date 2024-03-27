// import { GetCourseRegistrationQueryItemResponseDataType } from '~/types/course/courseRegistrationType';
import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query"
import { axios } from "~/configs";
import { GetListCourseRegistrationQueryItemResponseDataType, PatchCourseRegistrationRequestBodyType, PostCourseRegistrationRequestBodyType } from "~/types/course/courseRegistrationType";
import { PageOptionsType } from "~/types/metaType";

//GET /course-registrations
// const useGetCourseRegistrationsQuery = () => {
//     return useQuery({
//         queryKey: ['[GET] /course-registrations'],
//         queryFn: () => axios.get<Array<GetCourseRegistrationQueryItemResponseDataType>>('/course-registrations'),
//         select: (data) => data.data
//     })
// }

//GET /course-registrations/{id}
const useGetCourseRegistrationByStudentIdQuery = (
    options: { id: string },
    query?: PageOptionsType
) => {
    return useQuery({
        queryKey: ['[GET] /course-registrations/student/'],
        queryFn: () => axios.get<GetListCourseRegistrationQueryItemResponseDataType>(`/course-registrations/student/${options.id}`, { params: query }),
        select: (data) => data.data,
        enabled: !!options.id,
        retry: 3
    })
}

// POST /course-registrations
const usePostCourseRegistrationMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /course-registrations'],
        mutationFn: (requestBody: PostCourseRegistrationRequestBodyType) => axios.post('/course-registrations', requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /course-registrations']
            })
    })
}

//PATCH /course-registrations/{id}
const usePatchCourseRegistrationMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /course-registrations/{id}'],
        mutationFn: ({ id, requestBody }: { id: string; requestBody: PatchCourseRegistrationRequestBodyType }) =>
            axios.patch(`/course-registrations/${id}`, requestBody),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /course-registrations']
            })
    })
}

// DELETE /course-registrations/{id}
const useDeleteCourseRegistrationMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[DELETE] /course-registrations/{id}'],
        mutationFn: (id: string) => axios.delete(`/course-registrations/${id}`),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['[GET] /course-registrations']
            })
    })
}


export { 
    // useGetCourseRegistrationsQuery,
    useGetCourseRegistrationByStudentIdQuery,
    usePostCourseRegistrationMutation,
    usePatchCourseRegistrationMutation,
    useDeleteCourseRegistrationMutation
}