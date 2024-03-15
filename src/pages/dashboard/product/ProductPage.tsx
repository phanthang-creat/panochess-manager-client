// import { notification } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Modal, notification } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteProductMutation, useGetProductQuery } from '~/stores/server/product/productStore'
import { GetProductCategoryQueryItemResponseDataType } from '~/types/product-categories/productCategoryType'

export const ProductListPage = () => {
    const navigate = useNavigate()
  const [notificationApi, notificationContextHolder] = notification.useNotification()


    // const [notificationApi, notificationContextHolder] = notification.useNotification()
    const getDataQuery = useGetProductQuery()
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
    const deleteMutation = useDeleteProductMutation()
    const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)

    const columns: ColumnsType<GetProductCategoryQueryItemResponseDataType> = [
        {
            key: 'index',
            dataIndex: 'index',
            title: 'STT',
            align: 'center'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName',
            key: 'category'
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <div className='flex items-center justify-center gap-2'>
                    <Button
                        shape='circle'
                        icon={<EditOutlined />}
                        onClick={() => { navigate(`/product/${record.id}`) }}
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

    // Effect
    useEffect(() => {
        try {
            // console.log('getDataQuery.data', getDataQuery.data)
            if (!getDataQuery?.data) {
                return
            }
        } catch (error) {
            console.error(error)
        }
    }, [getDataQuery.data])

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
            Array.isArray(getDataQuery.data?.data)
                ? getDataQuery.data?.data.map((item, index) => ({ 
                    ...item, 
                    index: index + 1, 
                    key: item.id,
                    categoryName: item.category.name || { name: '' 
                } 
            })) : [],
        [getDataQuery.data?.data]
    )

    return (
        <div className=''>
            {notificationContextHolder}

            <h1 className='text-xl font-medium mb-4'>Danh sách sản phẩm</h1>
            <div className='flex flex-col items-start gap-4'>
                <Button type='primary' className='self-end' onClick={() => navigate('/product/creation')}>
                    Thêm mới
                </Button>

                {/* Table */}
                <Table className='w-full' columns={columns} dataSource={tableData} bordered loading={getDataQuery.isLoading} />
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
