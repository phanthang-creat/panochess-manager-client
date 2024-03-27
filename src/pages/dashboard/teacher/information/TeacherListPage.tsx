// import { notification } from "antd";
import { EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetTeachersQuery } from '~/stores/server/teacher/teacherStore'
import { GetTeacherQueryItemResponseDataType } from '~/types/teachers/teacherType'

export const TeacherListPage = () => {
    const navigate = useNavigate()

    // const [notificationApi, notificationContextHolder] = notification.useNotification()
    const getDataQuery = useGetTeachersQuery()

    const columns: ColumnsType<GetTeacherQueryItemResponseDataType> = [
        {
            key: 'index',
            dataIndex: 'index',
            title: 'STT',
            align: 'center'
        },
        {
            title: ' Họ tên',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob'
        },
        {
            title: 'Giới tính',
            dataIndex: 'genderName',
            key: 'genderId',
        },
        {
            title: 'Elo',
            dataIndex: 'elo',
            key: 'elo'
        },
        {
            // Phone
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            // Action
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <div className='flex items-center justify-center gap-2'>
                    <Button
                        shape='circle'
                        icon={<EditOutlined />}
                        onClick={() => { navigate(`/teacher/${record.id}`) }}
                    />
                    <Button
                        shape='circle'
                        icon={<HistoryOutlined />}
                        onClick={() => {
                            navigate(`/teacher/history/${record.id}`)
                        }}
                        // setSelectedItemId(record.id)
                        // setIsOpenConfirmDeleteModal(true)
                    />
                    <Button
                        shape='circle'
                        icon={<DeleteOutlined />}
                        onClick={() => {
                        // setSelectedItemId(record.id)
                        // setIsOpenConfirmDeleteModal(true)
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

    // Memos
    const tableData = useMemo(
        () =>
            Array.isArray(getDataQuery.data?.data)
                ? getDataQuery.data?.data.map((item, index) => ({ 
                    ...item, 
                    index: index + 1, 
                    key: item.id,
                    genderName: item.gender.name
                }))
                : [],
        [getDataQuery.data?.data]
    )

    return (
        <div className=''>
            {/* {notificationContextHolder} */}

            <h1 className='text-xl font-medium mb-4'>Danh sách giáo viên</h1>
            <div className='flex flex-col items-start gap-4'>
                <Button type='primary' className='self-end' onClick={() => navigate('/teacher/creation')}>
                    Thêm mới
                </Button>

                {/* Table */}
                <Table className='w-full' columns={columns} dataSource={tableData} bordered loading={getDataQuery.isLoading} />
            </div>
        </div>
    )
}
