// import { notification } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetStudentsQuery } from '~/stores/server/student/studentStore'
import { StudentResponseDataType } from '~/types/students/studentType'

export const StudentListPage = () => {
    const navigate = useNavigate()

    // const [notificationApi, notificationContextHolder] = notification.useNotification()
    const getDataQuery = useGetStudentsQuery()

    const columns: ColumnsType<StudentResponseDataType> = [
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
            title: 'Đang học',
            dataIndex: 'course.name',
            key: 'courseId',
            render: (courseName: string) => courseName || 'Chưa học'
        },
        {
            title: 'Tước hiệu',
            dataIndex: 'studentTitleName',
            key: 'studentTitleId',
            render: (studentTitleName: string) => studentTitleName || 'Chưa có'
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
                        onClick={() => { navigate(`/student/${record.id}`) }}
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
                    studentTitleName: item.studentTitle?.name,
                }))
                : [],
        [getDataQuery.data?.data]
    )

    return (
        <div className=''>
            {/* {notificationContextHolder} */}

            <h1 className='text-xl font-medium mb-4'>Danh sách học viên</h1>
            <div className='flex flex-col items-start gap-4'>
                <Button type='primary' className='self-end' onClick={() => navigate('/student/creation')}>
                    Thêm mới
                </Button>

                {/* Table */}
                <Table className='w-full' columns={columns} dataSource={tableData} bordered loading={getDataQuery.isLoading} />
            </div>
        </div>
    )
}
