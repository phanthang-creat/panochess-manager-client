/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Table, notification } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useDeleteProductCategoryMutation, useGetProductCategoriesQuery } from '~/stores/server/product-category/productCategoryStore'
import { GetProductCategoryQueryItemResponseDataType } from '~/types/product-categories/productCategoryType'

const ProductCategoryPage = () => {
  const navigate = useNavigate()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // States
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const getQuery = useGetProductCategoriesQuery()

  const deleteMutation = useDeleteProductCategoryMutation()

  // Constants
  const columns: ColumnsType<GetProductCategoryQueryItemResponseDataType> = [
    {
      key: 'index',
      dataIndex: 'index',
      title: 'STT',
      width: '10%'
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Tên',
      width: '25%'
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: 'Hành động',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-2'>
          <Button
            shape='circle'
            icon={<EditOutlined />}
            onClick={() => navigate(`/config/product-categories/update/${record.id}`)}
          />
          <Button
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedItemId(record.id)
              setIsOpenConfirmDeleteModal(true)
            }}
          />
        </div>
      )
    }
  ]

  // Methods
  const handleDeleteMenu = async () => {
    try {
      if (!selectedItemId) {
        return
      }
      await deleteMutation.mutateAsync(selectedItemId)
      handleCancelDeleting()
      return notificationApi.success({
        message: 'Thao tác thành công'
      })
    } catch (error) {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  const handleCancelDeleting = () => {
    setSelectedItemId(null)
    setIsOpenConfirmDeleteModal(false)
  }

  // Memos
  const tableData = useMemo(
    () =>
      Array.isArray(getQuery.data)
        ? getQuery.data.map((item, index) => ({ ...item, index: index + 1, key: item.id }))
        : [],
    [getQuery.data]
  )

  // Template
  return (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý khóa học</h1>

      <div className='flex flex-col items-start gap-4'>
        <Button type='primary' className='self-end' onClick={() => navigate('/config/product-categories/creation')}>
          Thêm mới
        </Button>
        {/* Table */}
        <Table
          className='w-full'
          columns={columns}
          dataSource={tableData}
          bordered
          loading={getQuery.isLoading}
        />
      </div>

      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        onOk={handleDeleteMenu}
        confirmLoading={deleteMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
    </div>
  )
}

export default ProductCategoryPage
