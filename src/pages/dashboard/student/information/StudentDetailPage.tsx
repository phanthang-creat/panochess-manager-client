import { EditFilled, MailOutlined, ManOutlined, PhoneOutlined, TagOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Modal, notification, Popconfirm, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BirthdayIcon } from '~/components/icons/BirthdayIcon'
import {
    useDeleteCourseRegistrationMutation,
    useGetCourseRegistrationByStudentIdQuery,
    usePatchCourseRegistrationMutation,
    usePostCourseRegistrationMutation
} from '~/stores/server/course/courseRegistrationStore'
import { useGetCoursesQuery } from '~/stores/server/course/courseStore'
import { useGetStudentByIdQuery } from '~/stores/server/student/studentStore'
import {
    GetCourseRegistrationQueryItemResponseDataType,
    PatchCourseRegistrationRequestBodyType,
    PostCourseRegistrationRequestBodyType
} from '~/types/course/courseRegistrationType'
import { PageOptionsType } from '~/types/metaType'
import viDayjs from 'dayjs/locale/vi'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { useGetClassByStudentIdAndCourseIdQuery } from '~/stores/server/class/classStudentStore'
import {
    GetClassStudentQueryItemResponseDataType,
    QueryClassStudentByStudentIdDataType
} from '~/types/class/classStudentType'
import TextArea from 'antd/es/input/TextArea'
import { useGetCourseRegistrationStatusQuery } from '~/stores/server/course/courseRegistrationStatusStore'

dayjs.extend(buddhistEra)
dayjs.locale(viDayjs)

type FormType = PostCourseRegistrationRequestBodyType

const FORM_INITIAL_VALUES: FormType = {
    courseId: '',
    studentId: '',
    // courseFee: 0,
    amountPaid: 0,
    description: '',
    statusId: 1
}

type ExpandedTableDataType = GetClassStudentQueryItemResponseDataType & { 
    index: number
    classStartDate: dayjs.Dayjs
    classTimeSlot: string
}

type TableDataType = GetCourseRegistrationQueryItemResponseDataType & {
    index: number
    courseName: string
    statusName: string
    expandedRowRenderData: ExpandedTableDataType[] | undefined
} 

export const StudentDetailPage = () => {
    const navigate = useNavigate()
    const [notificationApi, notificationContextHolder] = notification.useNotification()
    const { id } = useParams()

    const [query] = useState<PageOptionsType>({ page: 1, take: 10 })
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<GetCourseRegistrationQueryItemResponseDataType>()
    const [queryClass, setQueryClass] = useState<QueryClassStudentByStudentIdDataType>({
        courseId: ''
    })
    const [tableData, setTableData] = useState<TableDataType[] | undefined>(undefined)
    
    const getStudentByIdQuery = useGetStudentByIdQuery(id ?? '')
    const getCourseRegistrationByStudentIdQuery = useGetCourseRegistrationByStudentIdQuery({ id: id ?? '' }, query)
    const postMutation = usePostCourseRegistrationMutation()
    const patchMutation = usePatchCourseRegistrationMutation()
    const getCourseQuery = useGetCoursesQuery()
    const getClassByStudentIdQuery = useGetClassByStudentIdAndCourseIdQuery({ id: id ?? '' }, queryClass)
    const getCourseRegistrationStatusQuery = useGetCourseRegistrationStatusQuery()
    const deleteMutation = useDeleteCourseRegistrationMutation()

    const [form] = Form.useForm<FormType>()
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            values.studentId = id ?? ''
            await postMutation.mutateAsync(values)
            getCourseRegistrationByStudentIdQuery.refetch()

            setIsOpenModal(false)
            form.resetFields()
            notificationApi.success({
                message: 'Thêm khóa học thành công'
            })
        } catch (error) {
            notificationApi.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng kiểm tra lại thông tin'
            })
        }
    }

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields()

            const requestBody: PatchCourseRegistrationRequestBodyType = {
                amountPaid: values.amountPaid,
                statusId: values?.statusId,
                description: values.description
            }

            await patchMutation.mutateAsync({
                id: selectedCourse?.id ?? '',
                requestBody
            })

            getCourseRegistrationByStudentIdQuery.refetch()

            setIsOpenModal(false)
            form.resetFields()
            notificationApi.success({
                message: 'Cập nhật khóa học thành công'
            })
        } catch (error) {
            notificationApi.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng kiểm tra lại thông tin'
            })
        }
    }

    const columns: ColumnsType<TableDataType> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            render: (_text, _record, index) => index + 1,
            
        },
        {
            title: 'Khóa học',
            dataIndex: 'courseName',
            key: 'courseName',
            width: '15%'
        },
        {
            title: 'Học phí',
            dataIndex: 'courseFee',
            key: 'courseFee',
            width: '10%',
            render: (text) => text ? text.toLocaleString() : 'N/A'
        },
        {
            title: 'Số tiền đã đóng',
            dataIndex: 'amountPaid',
            key: 'amountPaid',
            width: '10%',
            render: (text, record) =>
                record.amountPaid < record.courseFee ? (
                    <span className='text-red-500'>{text ? text.toLocaleString() : 'N/A'}</span>
                ) : (
                    <span className='text-green-500'>{text ? text.toLocaleString() : 'N/A'}</span>
                )
        },
        {
            title: 'Đã học',
            dataIndex: 'classStudentsCount',
            key: 'classStudentsCount',
            width: '10%',
            render: (text, record) => (
                <span>
                    {text}/{record.course.numberOfSessions}
                </span>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusName',
            key: 'statusName',
            width: '10%'
        },
        {
            title: 'Ghi chú',
            dataIndex: 'description',
            key: 'description',
            width: '25%'
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            width: '15%',
            render: (_text, record) => (
                <Button
                    type='primary'
                    onClick={() => {
                        setSelectedCourse(record)
                        setIsOpenModal(true)
                        form.setFieldsValue({
                            courseId: record.courseId,
                            amountPaid: record.amountPaid,
                            description: record.description,
                            statusId: record.statusId
                        })
                    }}
                >
                    Sửa
                </Button>
            )
        }
    ]

    const columnsExpanded: ColumnsType<GetClassStudentQueryItemResponseDataType> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_text, _record, index) => index + 1
        },
        {
            title: 'Ngày',
            dataIndex: 'classStartDate',
            key: 'classStartDate',
            render: (text) => dayjs(text).format('DD/MM/YYYY')
        },
        {
            title: 'Khung giờ',
            dataIndex: 'classTimeSlot',
            key: 'classTimeSlot'
        }
    ]

    useEffect(() => {
        if (!getCourseRegistrationByStudentIdQuery.data) return

        setTableData(getCourseRegistrationByStudentIdQuery.data?.data.map((item, index) => ({
            ...item,
            index: index + 1,
            courseName: item.course?.name ?? 'N/A',
            statusName: item.status?.name ?? 'N/A',
            expandedRowRenderData: new Array<ExpandedTableDataType>()
        })))
    }, [getCourseRegistrationByStudentIdQuery.data])

    useEffect(() => {
        if (!getClassByStudentIdQuery.data) return

        const classStudent = getClassByStudentIdQuery.data?.map((item, index) => ({
            ...item,
            index: index + 1,
            classStartDate: dayjs(item.class.startTime),
            classTimeSlot: dayjs(item.class.startTime).format('HH:mm') + ' - ' + dayjs(item.class.endTime).format('HH:mm')
        }))

        const newTableData = tableData?.map((item) => {
            if (item.id === queryClass.courseId) {
                item.expandedRowRenderData = classStudent as ExpandedTableDataType[]
            }

            return item
        })

        setTableData(newTableData)

    }, [getClassByStudentIdQuery.data, queryClass.courseId, tableData])



    useEffect(() => {
        if (!getStudentByIdQuery.data) return

        getClassByStudentIdQuery.refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryClass])

    

    return (
        <div className='flex flex-col items-start'>
            {notificationContextHolder}
            <div className='grid grid-flow-row gap-4 grid-cols-1 w-full'>
                <div className='grid grid-flow-row gap-4 grid-cols-1 bg-white p-4 rounded-md shadow-md'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <div className='flex items-center'>
                                <Avatar size={64} style={{ backgroundColor: '#f1ca7b' }} src={getStudentByIdQuery.data?.avatar}>
                                    {getStudentByIdQuery.data?.name[0].toUpperCase()}
                                </Avatar>

                                <div className='ml-4'>
                                    <div className='text-lg font-semibold'>{getStudentByIdQuery.data?.name}</div>
                                    <div className='text-sm text-gray-400'>
                                        <MailOutlined className='mr-2' />
                                        {getStudentByIdQuery.data?.email}
                                    </div>

                                    <div className='text-sm text-gray-400'>Elo: {getStudentByIdQuery.data?.elo}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button icon={<EditFilled />} className='text-sm' onClick={() => navigate(`/student/edit/${id}`)}>
                            Sửa thông tin
                        </Button>
                    </div>
                    <div className='grid grid-flow-row gap-4 grid-cols-2 mt-4 border-t border-gray-200 pt-4'>
                        <div className='grid grid-flow-row gap-4 grid-cols-1 border-r border-gray-200 pr-4'>
                            <div className='text-lg font-semibold'>Thông tin cá nhân</div>
                            <div className='grid grid-flow-row gap-4 grid-cols-2'>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <PhoneOutlined className='mr-2' />
                                        {getStudentByIdQuery.data?.phone}
                                    </p>
                                </div>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p className='flex items-center'>
                                        <span className='mr-2'>
                                            <BirthdayIcon />
                                        </span>
                                        <span>{getStudentByIdQuery.data?.dob}</span>
                                    </p>
                                </div>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <span className='mr-2'>
                                            <ManOutlined />
                                        </span>
                                        {getStudentByIdQuery.data?.gender.name}
                                    </p>
                                </div>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <span className='mr-2'>
                                            <TagOutlined />
                                        </span>
                                        {getStudentByIdQuery.data?.studentTitle.name}
                                    </p>
                                </div>

                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <span className='mr-2'>
                                            <TagOutlined />
                                        </span>
                                        {getStudentByIdQuery.data?.studentStatus.name}
                                    </p>
                                </div>

                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <span className='mr-2'>
                                            <TagOutlined />
                                        </span>
                                        {getStudentByIdQuery.data?.branch.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Parent */}
                        <div className='grid grid-flow-row gap-4 grid-cols-1'>
                            <div className='text-lg font-semibold'>Thông tin phụ huynh</div>
                            <div className='grid grid-flow-row gap-4 grid-cols-2'>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <TagOutlined className='mr-2' />
                                        {getStudentByIdQuery.data?.studentParent.motherName
                                            ? getStudentByIdQuery.data?.studentParent.motherName
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <TagOutlined className='mr-2' />
                                        {getStudentByIdQuery.data?.studentParent.fatherName
                                            ? getStudentByIdQuery.data?.studentParent.fatherName
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <MailOutlined className='mr-2' />
                                        {getStudentByIdQuery.data?.studentParent.motherEmail
                                            ? getStudentByIdQuery.data?.studentParent.motherEmail
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <MailOutlined className='mr-2' />
                                        {getStudentByIdQuery.data?.studentParent.fatherEmail
                                            ? getStudentByIdQuery.data?.studentParent.fatherEmail
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <PhoneOutlined className='mr-2' />
                                        {getStudentByIdQuery.data?.studentParent.motherPhone
                                            ? getStudentByIdQuery.data?.studentParent.motherPhone
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div className='grid grid-flow-row gap-4 grid-cols-1'>
                                    <p>
                                        <PhoneOutlined className='mr-2' />
                                        {getStudentByIdQuery.data?.studentParent.fatherPhone
                                            ? getStudentByIdQuery.data?.studentParent.fatherPhone
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full bg-white p-4 rounded-md shadow-md mt-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='text-lg font-semibold'>Danh sách khóa học</div>
                    <Button type='primary' onClick={() => setIsOpenModal(true)}>
                        Thêm khóa học
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={tableData}
                    rowKey='id'
                    bordered
                    pagination={{
                        current: query.page,
                        pageSize: query.take,
                        total: getCourseRegistrationByStudentIdQuery.data?.meta.itemCount,
                        onChange: (page) => {
                            query.page = page
                            getCourseRegistrationByStudentIdQuery.refetch()
                        }
                    }}
                    expandable={{
                        onExpand: (expanded, record) => {
                            if (expanded) {
                                setQueryClass({
                                    courseId: record.id
                                })
                            }
                        },
                        expandedRowRender: (record) => {
                            return <Table
                                columns={columnsExpanded}
                                dataSource={record.expandedRowRenderData}
                                rowKey='id'
                                pagination={false}
                                title={() =>
                                    <div className='text-lg font-semibold'>
                                        Lịch học
                                    </div>
                                }
                            />
                        }
                    }}
                />
            </div>

            <Modal
                title='Thêm khóa học'
                // onCancel={() => navigate(`/student/edit/${id}`)}
                footer={null}
                open={isOpenModal}
                closable={true}
                onOk={() => {
                    setIsOpenModal(false)
                    form.resetFields()
                }}
                onCancel={() => {
                    setIsOpenModal(false)
                    form.resetFields()
                    selectedCourse && setSelectedCourse(undefined)
                }}
            >
                <Form form={form} layout='vertical' initialValues={FORM_INITIAL_VALUES}>
                    <Form.Item<FormType>
                        label='Khóa học'
                        name='courseId'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn khóa học'
                            }
                        ]}
                    >
                        <Select
                            className='w-full'
                            placeholder='Chọn khóa học'
                            options={getCourseQuery.data?.map((item) => ({
                                label: `${item.name} - ${item.price.toLocaleString()} VNĐ`,
                                value: item.id
                            }))}
                            disabled={!!selectedCourse}
                        />
                    </Form.Item>

                    <Form.Item<FormType>
                        label='Số tiền đã đóng'
                        name='amountPaid'
                        rules={[{ required: true, message: 'Vui lòng nhập số tiền đã đóng' }]}
                    >
                        <Input
                            type='number'
                            className='w-full border border-gray-300 rounded-md p-2'
                            placeholder='Nhập số tiền đã đóng'
                        />
                    </Form.Item>

                    <Form.Item<FormType> label='Ghi chú' name='description'>
                        <TextArea className='w-full border border-gray-300 rounded-md p-2' placeholder='Nhập ghi chú' rows={10} />
                    </Form.Item>

                    {
                        selectedCourse && (
                            <Form.Item<FormType>
                                label='Trạng thái'
                                name='statusId'
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                            >
                                <Select
                                    className='w-full'
                                    placeholder='Chọn trạng thái'
                                    options={getCourseRegistrationStatusQuery.data?.map((item) => ({
                                        label: item.name,
                                        value: item.id,
                                    }))}
                                />
                            </Form.Item>
                        )
                    }

                    <Form.Item>
                        <Button type='primary' onClick={selectedCourse ? handleUpdate : handleSubmit}>
                            {selectedCourse ? 'Cập nhật' : 'Thêm'}
                        </Button>

                        <Popconfirm
                            title='Bạn có chắc chắn muốn xóa không?'
                            onConfirm={() => {
                                if (!selectedCourse) return
                                if (selectedCourse.classStudentsCount > 0) {
                                    notificationApi.error({
                                        message: 'Không thể xóa',
                                        description: 'Học sinh đã tham gia khóa học'
                                    })
                                    return
                                }
                                deleteMutation.mutate(selectedCourse?.id ?? '')
                            }}
                            okText='Có'
                            cancelText='Không'
                            description='Bạn sẽ không thể xóa khóa học khi học sinh đã bắt đầu khóa học'
                        >
                            <Button danger className='ml-4'>
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
