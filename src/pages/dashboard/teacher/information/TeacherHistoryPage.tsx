import Table, { ColumnsType } from "antd/es/table"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetClassTeachersQuery } from "~/stores/server/class/classTeacherStore"
import { GetClassTeacherByTeacherQueryItemResponseDataType, QueryGetClassTeacherDataType } from "~/types/class/classTeacherType"
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import viDayjs from 'dayjs/locale/vi'
import { useGetTeacherBasicInfoByIdQuery } from "~/stores/server/teacher/teacherStore"
import { Avatar, Button, DatePicker } from "antd"
import { EditFilled, MailFilled, PayCircleOutlined, PhoneFilled } from "@ant-design/icons"
// import { v4 } from 'uuid'

dayjs.extend(buddhistEra)
dayjs.locale(viDayjs)

interface DataType {
    month: string
    numberClass: number
    basicSalary: number
    totalSalary: number
}

export const TeacherHistoryPage = () => {

    const { id } = useParams()

    const navigate = useNavigate()

    const [query, setQuery] = useState<QueryGetClassTeacherDataType>({
        teacherId: id,
        month: '2024-03'
    })

    const getTeacherQuery = useGetTeacherBasicInfoByIdQuery(id ?? '')

    const getDataQuery = useGetClassTeachersQuery(query)

    useEffect(() => {
        getDataQuery.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    const tableExpandedData = useMemo(
        () =>
            Array.isArray(getDataQuery.data?.data)
                ? getDataQuery.data?.data.map((item, index) => ({ 
                    ...item, 
                    index: index + 1, 
                    key: item.id,
                    day: dayjs(item.class.startTime).format('YYYY-MM-DD'),
                    timeSlot: {
                        start: dayjs(item.class.startTime).format('HH:mm'),
                        end: dayjs(item.class.endTime).format('HH:mm')
                    },
                }))
                : [],
        [getDataQuery.data?.data]
    )



    const tableData = useMemo(
        () => {
            if (!getDataQuery.data) return []
            const data: DataType[] = []
            getDataQuery.data?.data.forEach(item => {
                const month = dayjs(item.class.startTime).format('YYYY-MM')
                const index = data.findIndex(i => i.month === month)
                if (index === -1) {
                    data.push({
                        month,
                        numberClass: 1,
                        basicSalary: getTeacherQuery.data?.basicSalary ?? 0,
                        totalSalary: getTeacherQuery.data?.basicSalary ?? 0
                    })
                } else {
                    data[index].numberClass += 1
                    data[index].totalSalary += getTeacherQuery.data?.basicSalary ?? 0
                }
            })
            return data
        },
        [getDataQuery.data, getTeacherQuery.data?.basicSalary]
    )

    const columnsExpanded: ColumnsType<GetClassTeacherByTeacherQueryItemResponseDataType> = [
        {
            key: 'index',
            dataIndex: 'index',
            title: 'STT',
            align: 'center',
            width: '10%'
        },
        {
            key: 'day',
            dataIndex: 'day',
            title: 'Ngày',
            // render: (record) => record.()
        },
        {
            key: 'timeSlot',
            dataIndex: 'timeSlot',
            title: 'Ca học',
            render: (record) => `${record.start} - ${record.end}`
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Trạng thái',
            render: (_, record) => record.class.classStatus.name
        }
    ]

    const columns: ColumnsType<DataType> = [
        {
            key: 'month',
            dataIndex: 'month',
            title: 'Tháng',
            align: 'center',
            width: '20%'
        },
        {
            key: 'numberClass',
            dataIndex: 'numberClass',
            title: 'Số lớp',
            align: 'center',
            width: '20%'
        },
        {
            key: 'basicSalary',
            dataIndex: 'basicSalary',
            title: 'Lương cơ bản',
            align: 'center',
            render: (record) => record.toLocaleString(),
            width: '20%'
        },
        {
            key: 'totalSalary',
            dataIndex: 'totalSalary',
            title: 'Tổng lương',
            align: 'center',
            render: (record) => record.toLocaleString(),
            width: '20%'
        },
        {
            key: 'action',
            dataIndex: 'action',
            title: 'Chi tiết',
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        navigate(`/class/${record.month}/${id}`)
                    }}
                    disabled={true}
                >
                    Xem chi tiết
                </Button>
            )
        }
    ]

    return (
        <div>
            <div>
                <div className="bg-white p-4 mt-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {
                                getTeacherQuery.data?.avatar ? (
                                    <img
                                        src={getTeacherQuery.data?.avatar}
                                        alt="avatar"
                                        className="w-16 h-16 rounded-full"
                                    />
                                ) : (
                                    <Avatar
                                        size={64}
                                        style={{ backgroundColor: '#f1ca7b' }}
                                    >
                                        {getTeacherQuery.data?.name[0].toUpperCase()}
                                    </Avatar>
                                )
                            }
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">
                                    {getTeacherQuery.data?.name}
                                    <Button
                                        icon={<EditFilled />}
                                        className="ml-4 text-sm border-none"
                                        onClick={() => navigate(`/teacher/${id}`)}
                                    >
                                        Sửa thông tin
                                    </Button>
                                </h3>
                                <p className="text-sm text-gray-500">
                                    <MailFilled className="mr-2" />
                                    {getTeacherQuery.data?.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <PhoneFilled className="mr-2" />
                                    {getTeacherQuery.data?.phone}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <PayCircleOutlined className="mr-2" />
                                    {getTeacherQuery.data?.basicSalary.toLocaleString()} VND
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">
                    Lịch sử giảng dạy
                </h3>
                <DatePicker
                    picker="month"
                    className="mt-2"
                    value={dayjs(query.month)}
                    onChange={(date) => {
                        setQuery({
                            ...query,
                            month: dayjs(date).format('YYYY-MM')
                        })
                    }}
                    allowClear={false}
                />
            </div>

            <Table
                columns={columns}
                dataSource={tableData}
                loading={getDataQuery.isLoading}
                rowKey='month'
                pagination={false}
                expandable={{
                    expandedRowRender: () => (
                        <Table
                            columns={columnsExpanded}
                            dataSource={tableExpandedData}
                            rowKey={record => record.id}
                            pagination={false}
                            style={{ margin: '0 24px' }}
                        />
                    ),
                }}
            />
        </div>
    )
}