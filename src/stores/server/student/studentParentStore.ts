import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatchStudentParentRequestBodyType, PostStudentParentRequestBodyType } from "~/types/students/studentParentType";
import { axios } from "~/configs";

const usePostStudentParentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[POST] /student-parent'],
        mutationFn: (data: PostStudentParentRequestBodyType) => axios.post('/student-parent', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['[GET] /student-parent'] })
        }
    })

}

const usePatchStudentParentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['[PATCH] /student-parent'],
        mutationFn: ({ id, data }: { id: string; data: PatchStudentParentRequestBodyType }) => axios.patch(`/student-parent/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['[GET] /student-parent'] })
        }
    })
}


export { 
    usePostStudentParentMutation,
    usePatchStudentParentMutation
}