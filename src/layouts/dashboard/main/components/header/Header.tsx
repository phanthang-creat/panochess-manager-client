import { Dispatch, SetStateAction, FC, useEffect, useState } from 'react'
import { Layout, Button, Select } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useGetBranchQuery } from '~/stores/server/branch/branchStore'

interface Props {
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
}

const { Header: LayoutHeader } = Layout

const Header: FC<Props> = ({ collapsed, setCollapsed }) => {

  const getBranchQuery = useGetBranchQuery()

  const [branchId, setBranchId] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!getBranchQuery.data) {
      return
    }
    setBranchId(Number(sessionStorage.getItem('branchId')) || getBranchQuery.data[0].id)

    if (!sessionStorage.getItem('branchId')) {
      sessionStorage.setItem('branchId', getBranchQuery.data[0].id.toString())
    }
  }, [
    getBranchQuery.data,
    // branchId
  ])

  return (
    <LayoutHeader className='sticky top-0 w-full p-0 h-header bg-[#333333] z-[999] flex items-center justify-between'>
      <Button
        type='text'
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className='text-base text-white/80 hover:!text-white hover:!bg-neutral-700 !w-[38px]'
      />

      {/* Switch Branch */}
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder='Chọn chi nhánh'
        // value={sessionStorage.getItem('branchId') || undefined}
        optionFilterProp='children'
        value={branchId}
        onChange={(value) => {
          sessionStorage.setItem('branchId', value.toString())
          setBranchId(Number(value))
          window.location.reload()
        }}
        disabled={getBranchQuery.isLoading || getBranchQuery.data?.length === 1}
        className='!mr-4'
      >
        {getBranchQuery.data?.map((branch) => (
          <Select.Option key={branch.id} value={branch.id} >
            {branch.name}
          </Select.Option>
        ))}
      </Select>
    </LayoutHeader>
  )
}

export default Header
