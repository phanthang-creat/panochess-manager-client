import { useQuery } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetBranchQueryItemResponseDataType } from "~/types/branchType"

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
export { useGetBranchQuery }