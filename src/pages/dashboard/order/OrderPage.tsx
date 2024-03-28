// import { notification } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Input, notification, Popconfirm, Popover } from 'antd'
import Table, { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useGetOrderStatusesQuery } from '~/stores/server/order/orderStatusStore'
import { useDeleteOrderMutation, useGetOrderQuery } from '~/stores/server/order/orderStore'
import { GetOrderQuery, GetOrderQueryItemResponseDataType } from '~/types/order/orderType'

export const OrderListPage = () => {
    const navigate = useNavigate()
  const [notificationApi, notificationContextHolder] = notification.useNotification()


    // const [notificationApi, notificationContextHolder] = notification.useNotification()
    // const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
    const deleteMutation = useDeleteOrderMutation()
    // const getOrderStatusQuery = useGetOrderStatusesQuery()
    // const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
    const [query, setQuery] = useState<GetOrderQuery>({
        page: 1,
        take: 10
    })

    const [form] = Form.useForm<GetOrderQuery>()
      
    const getDataQuery = useGetOrderQuery(query)
    const columns: ColumnsType<GetOrderQueryItemResponseDataType> = [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'Mã đơn hàng',
            align: 'center',
            width: '8%',
        },
        {
            key: 'createdAt',
            dataIndex: 'createdAt',
            title: 'Ngày tạo',
            width: '15%',
            render: (value) => <span>{new Date(value).toLocaleDateString()}</span>
        },
        {
            title: 'Khách hàng',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'orderStatus',
            key: 'status',
            render: (value) => value.id === 1 ? 
                <span className='text-red-500'>{value.name}</span>
                 : 
                value.id === 3 ? 
                <span className='text-yellow-500'>{value.name}</span>
                 : 
                <span className='text-green-500'>{value.name}</span>
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            render: (value) => <span>{value.toLocaleString()} đ</span>
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
                        onClick={() => { navigate(`/order/${record.id}`) }}
                    />
                    <Popover>
                        <Popconfirm
                            title='Bạn có chắc chắn muốn xóa đơn hàng này không?'
                            onConfirm={() => {
                                handleDeleteMenu(record.id)
                            }}
                            okText='Xóa'
                            cancelText='Hủy'
                            disabled={record.orderStatus.id !== 1 && record.orderStatus.id !== 3}
                            >
                            <Button
                                shape='circle'
                                icon={<DeleteOutlined />}
                                disabled={record.orderStatus.id !== 1 && record.orderStatus.id !== 3}
                            />
                        </Popconfirm>
                    </Popover>
                </div>
            )
        }
    ]

    // Search
    const handleSearch = () => {

        const value = form.getFieldsValue()

        setQuery({
            ...query,
            ...value
        })

        getDataQuery.refetch()
    }

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
    const handleDeleteMenu = async (id: string) => {
        try {
            
            await deleteMutation.mutateAsync(id)

            return notificationApi.success({
                message: 'Thao tác thành công'
            })
            } catch (error) {
            return notificationApi.error({
                message: 'Thao tác thất bại'
            })
        }
    }

    // Memos
    const tableData = useMemo(
        () =>
            Array.isArray(getDataQuery.data?.data)
                ? getDataQuery.data?.data.map((item) => ({ 
                    ...item, 
                    key: item.id,
                    status: item.orderStatus.name
                } 
            )) : [],
        [getDataQuery.data?.data]
    )

    return (
        <div className=''>
            {notificationContextHolder}

            <h1 className='text-xl font-medium mb-4'>Danh sách đơn hàng</h1>
            <div className='flex flex-col items-start gap-4'>

                <Button type='primary' className='self-end' onClick={() => navigate('/order/creation')}>
                    Thêm mới
                </Button>

                {/* Filter */}
                <Form 
                    className='flex items-center gap-4' 
                    method='GET' 
                    onFinish={handleSearch}
                    form={form}
                >
                    <Form.Item<GetOrderQuery>
                        name='name'
                        rules={[{ required: false }]}
                    >
                        <Input 
                            type='text' 
                            placeholder='Tìm kiếm' 
                            className='w-96 p-2 border border-gray-300 rounded-md' 
                            onChange={(e) => {
                                form.setFieldValue('id', e.target.value)
                            }
                        }
                        />
                    </Form.Item>

                    {/* hidden */}
                    <Form.Item
                        name='id'
                        hidden
                    >
                        <Input type='text' />
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit' onClick={() => form.submit()}>Tìm kiếm</Button>
                    </Form.Item>
                </Form>
                
                {/* Table */}
                <Table
                    className='w-full'
                    columns={columns}
                    dataSource={tableData}
                    bordered
                    loading={getDataQuery.isLoading} 
                    pagination={{
                        total: getDataQuery.data?.meta.itemCount,
                        pageSize: query.take,
                        pageSizeOptions: [10, 20, 50],
                        showSizeChanger: true
                    }}
                    onChange={(pagination: TablePaginationConfig) =>
                        setQuery({
                          page: pagination.current ?? 1,
                          take: pagination.pageSize ?? 10
                        })
                      }
                />
            </div>
        </div>
    )
}
