import { useQuery } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetGenderQueryItemResponseDataType } from "~/types/genderType"

const useGetGenderQuery = () => {
    return useQuery({
        queryKey: ['[GET] /gender/'],
        queryFn: () => axios.get<
            Array<GetGenderQueryItemResponseDataType>
        >(`/gender`),
        select: (data) => data.data,
        retry: 3
    })
}
export { useGetGenderQuery }