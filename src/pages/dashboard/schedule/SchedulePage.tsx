import { Calendar, Culture, DateLocalizer, SlotInfo, Views, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { vi } from 'date-fns/locale/vi'
import './SchedulePage.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button, DatePicker, Form, Input, List, Modal, Popconfirm, Select, Spin, Tag } from 'antd'
import { useGetClasssStatusesQuery } from '~/stores/server/class/classStatusStore'
import { useGetTeachersQuery } from '~/stores/server/teacher/teacherStore'
import {
    GetClassQueryItemResponseDataType,
    PatchClassRequestBodyType,
    PostClassRequestBodyType,
    QueryGetClassDataType
} from '~/types/class/classType'
import dayjs, { Dayjs } from 'dayjs'
import { useGetClassroomsQuery } from '~/stores/server/classroom/classroomStore'
import {
    useDeleteClassMutation,
    useGetClassesQuery,
    usePatchClassMutation,
    usePostClassMutation
} from '~/stores/server/class/classStore'
import useNotification from 'antd/es/notification/useNotification'
import { Day } from 'node_modules/date-fns/types'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import viPicker from 'antd/es/date-picker/locale/vi_VN'
import { compareArrays } from '~/utils/compareArrays'
import { useGetTimeSlotsQuery } from '~/stores/server/timeSlot/timeSlotStore'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useGetClassStudentsQuery, usePostClassStudentMutation } from '~/stores/server/class/classStudentStore'
import { QueryClassStudentDataType } from '~/types/class/classStudentType'
import { QueryGetStudentType } from '~/types/students/studentType'
import { useGetStudentTimeSlotsQuery } from '~/stores/server/student/studentStore'
import viDayjs from 'dayjs/locale/vi'
import { ScheduleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

dayjs.extend(buddhistEra)
dayjs.locale(viDayjs)

interface FormType {
    startTime: Dayjs
    endTime: Dayjs
    classroomId: string
    statusId: number
    classTeachers: string[]
    description?: string
}

const locales = {
    vi: vi
    // 'en-US': en,
}

const buddhistLocale: typeof viPicker = {
    ...viPicker,
    lang: {
        ...viPicker.lang,
        placeholder: 'Chọn ngày',
        yearPlaceholder: 'Chọn năm',
        quarterPlaceholder: 'Chọn quý',
        monthPlaceholder: 'Chọn tháng',
        weekPlaceholder: 'Chọn tuần',
        rangeYearPlaceholder: ['Năm bắt đầu', 'Năm kết thúc'],
        rangeQuarterPlaceholder: ['Quý bắt đầu', 'Quý kết thúc'],
        rangeMonthPlaceholder: ['Tháng bắt đầu', 'Tháng kết thúc'],
        rangeWeekPlaceholder: ['Tuần bắt đầu', 'Tuần kết thúc'],
        rangePlaceholder: ['Ngày bắt đầu', 'Ngày kết thúc']
    },
    timePickerLocale: {
        placeholder: 'Chọn giờ'
    }
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

class EventType {
    constructor(title: string, allDay: boolean, start: Date, end: Date, resource: GetClassQueryItemResponseDataType) {
        this.title = title
        this.allDay = allDay ?? false
        this.start = start
            ; (this.end = end), (this.resource = resource)
    }

    title: string
    allDay: boolean = false
    start: Date
    end: Date
    resource: GetClassQueryItemResponseDataType
}

export const SchedulePage = () => {
    // state
    const [notificationApi, notificationContextHolder] = useNotification()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [events, setEvents] = useState<EventType[]>([])
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
    // const [listStudents, setListStudents] = useState<string[]>([])
    const [query, setQuery] = useState<QueryClassStudentDataType>({
        classId: '',
        page: 1,
        take: 10
    })

    const [studentQuery, setStudentQuery] = useState<QueryGetStudentType>({
        page: 1,
        take: 1
    })

    const [classQuery, setClassQuery] = useState<QueryGetClassDataType>({
        startDate: dayjs().startOf('week').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD')
    })

    const [gotWeek, setGotWeek] = useState<number[]>([dayjs().startOf('week').unix()])

    // queries
    const getClassStatusesQuery = useGetClasssStatusesQuery()
    const getTeachersQuery = useGetTeachersQuery()
    const getClassroomQuery = useGetClassroomsQuery()
    const getClassMutation = useGetClassesQuery(classQuery)
    const getTimeSlotsQuery = useGetTimeSlotsQuery()
    const getClassStudentsQuery = useGetClassStudentsQuery(query)
    const getStudentTimeSlotsQuery = useGetStudentTimeSlotsQuery(studentQuery)
    const deleteClassMutation = useDeleteClassMutation()

    // mutations
    const postClassMutation = usePostClassMutation()
    const postClassStudentMutation = usePostClassStudentMutation()
    const patchClassMutation = usePatchClassMutation()

    const [form] = Form.useForm<FormType>()
    const clickRef = useRef(0)

    const handleSubmit = async () => {
        const formValues = form.getFieldsValue()

        const listTeachers = formValues.classTeachers.map((teacher) => {
            return {
                teacherId: teacher
            }
        })

        if (selectedEvent) {
            if (!selectedEvent.resource) {
                return notificationApi.error({
                    message: 'Thao tác thất bại'
                })
            }
            // Update
            const requestBody: PatchClassRequestBodyType = {
                // compare with the previous start time by timestamp
                startTime:
                    formValues.startTime.unix() !== selectedEvent.start.getTime() / 1000
                        ? formValues.startTime.toString()
                        : undefined,
                endTime:
                    formValues.endTime.unix() !== selectedEvent.end.getTime() / 1000 ? formValues.endTime.toString() : undefined,
                classroomId:
                    formValues.classroomId !== selectedEvent.resource.classroom.id ? formValues.classroomId : undefined,
                statusId: formValues.statusId !== selectedEvent.resource.classStatus.id ? formValues.statusId : undefined,
                // compare with the previous list of teachers
                classTeachers: compareArrays(
                    listTeachers.map((teacher) => teacher.teacherId),
                    selectedEvent.resource.classTeachers.map((teacher) => teacher.teacher.id)
                )
                    ? undefined
                    : listTeachers
            }

            for (const key in requestBody) {
                if (requestBody[key as keyof PatchClassRequestBodyType] === undefined) {
                    delete requestBody[key as keyof PatchClassRequestBodyType]
                }
            }

            if (Object.keys(requestBody).length === 0) {
                setIsModalOpen(false)
                return notificationApi.info({
                    message: 'Không có thay đổi'
                })
            }

            try {
                await patchClassMutation.mutateAsync({
                    id: selectedEvent.resource?.id || '',
                    requestBody
                })
                setIsModalOpen(false)
                setEvents(
                    events.map((event) => {
                        if (event.resource?.id === selectedEvent.resource?.id) {
                            return new EventType(
                                `${getClassroomQuery.data?.find((classroom) => classroom.id === formValues.classroomId)?.name
                                } - ${getTeachersQuery.data?.data
                                    .filter((teacher) => formValues.classTeachers.includes(teacher.id))
                                    .map((teacher) => ({
                                        id: '',
                                        createdAt: '',
                                        updatedAt: '',
                                        classId: '',
                                        teacherId: '',
                                        teacher: teacher
                                    }))
                                    ?.map((teacher) => teacher.teacher.name)
                                    .join(', ')} - ${getClassStatusesQuery.data?.find((status) => status.id === formValues.statusId)?.name
                                }`,
                                false,
                                formValues.startTime.toDate(),
                                formValues.endTime.toDate(),
                                {
                                    ...selectedEvent.resource,
                                    classroom:
                                        getClassroomQuery.data?.find((classroom) => classroom.id === formValues.classroomId) ||
                                        selectedEvent.resource.classroom,
                                    classStatus:
                                        getClassStatusesQuery.data?.find((status) => status.id === formValues.statusId) ||
                                        selectedEvent.resource.classStatus,
                                    classTeachers:
                                        getTeachersQuery.data?.data
                                            .filter((teacher) => formValues.classTeachers.includes(teacher.id))
                                            .map((teacher) => ({
                                                id: '',
                                                createdAt: '',
                                                updatedAt: '',
                                                classId: '',
                                                teacherId: '',
                                                teacher: teacher
                                            })) || selectedEvent.resource.classTeachers
                                }
                            )
                        }
                        return event
                    })
                )
                return notificationApi.success({
                    message: 'Cập nhật thành công'
                })
            } catch (error) {
                return notificationApi.error({
                    message: 'Cập nhật thất bại'
                })
            }
        } else {
            const requestBody: PostClassRequestBodyType = {
                startTime: formValues.startTime.toString(),
                endTime: formValues.endTime.toString(),
                classroomId: formValues.classroomId,
                statusId: 1,
                classTeachers: listTeachers
            }

            try {
                const newClass = await postClassMutation.mutateAsync(requestBody)

                setEvents(
                    events.concat(
                        new EventType(
                            `${getClassroomQuery.data?.find((classroom) => classroom.id === formValues.classroomId)?.name
                            } - ${getTeachersQuery.data?.data
                                .filter((teacher) => formValues.classTeachers.includes(teacher.id))
                                .map((teacher) => teacher.name)
                                .join(', ')} - ${getClassStatusesQuery.data?.find((status) => status.id === 1)?.name}`,
                            false,
                            formValues.startTime.toDate(),
                            formValues.endTime.toDate(),
                            newClass.data
                        )
                    )
                )

                setIsModalOpen(false)

                return notificationApi.success({
                    message: 'Thao tác thành công'
                })
            } catch (error) {
                return notificationApi.error({
                    message: 'Thao tác thất bại'
                })
            }
        }
    }

    const handleDeleteClass = async () => {
        if (selectedEvent) {
            try {
                await deleteClassMutation.mutateAsync(selectedEvent.resource?.id || '')
                setIsModalOpen(false)
                setEvents(events.filter((event) => event.resource?.id !== selectedEvent.resource?.id))
                return notificationApi.success({
                    message: 'Xóa thành công'
                })
            } catch (error) {
                return notificationApi.error({
                    message: 'Xóa thất bại'
                })
            }
        }
    }

    const handleAddStudent = async (studentId: string) => {
        try {
            await postClassStudentMutation.mutateAsync({
                classId: selectedEvent?.resource?.id || '',
                studentId
            })
            return notificationApi.success({
                message: 'Thêm học viên thành công'
            })
        } catch (error) {
            return notificationApi.error({
                message: 'Thêm học viên thất bại'
            })
        }
    }

    const onSelectEvent = (event: EventType) => {
        setSelectedEvent(event)
        const formValues = {
            startTime: dayjs(event.start),
            endTime: dayjs(event.end),
            classroomId: event.resource?.classroom.id || '', // Ensure classroomId is always a string
            statusId: event.resource?.classStatus.id || 1, // Ensure statusId is always a number
            classTeachers: event.resource?.classTeachers.map((teacher) => teacher.teacher.id) || [],
            description: event.resource?.description || ''
        }

        form.setFieldsValue(formValues)

        // Get students
        setQuery({
            ...query,
            classId: event.resource?.id || ''
        })

        // setListStudents(getClassStudentsQuery.data?.data.map((item) => item.student.name) || [])

        // console.log('event', event)
        setStudentQuery((prevQuery) => ({
            ...prevQuery,
            take: 10,
            timeSlotId:
                getTimeSlotsQuery.data?.find(
                    (timeSlot) =>
                        timeSlot.start === dayjs(event.start).format('HH:mm:ss') &&
                        timeSlot.end === dayjs(event.end).format('HH:mm:ss')
                )?.id || 0,
            dayOfWeek: event.start.getDay()
        }))

        setIsModalOpen(true)
    }

    useEffect(() => {
        getStudentTimeSlotsQuery.refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentQuery])

    useEffect(() => {
        getClassStudentsQuery.refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    useEffect(() => {
        getClassMutation.refetch()
        console.log('classQuery', classQuery)
        console.log('gotWeek', gotWeek)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classQuery])

    const formats = useMemo(
        () => ({
            dateFormat: 'dd',
            dayFormat: (date: Date, culture?: Culture, localizer?: DateLocalizer) => {
                return (
                    vi.localize.day(date.getDay() as Day, { width: 'short' }) + ' ' + localizer?.format(date, 'dd/MM', culture)
                )
            },
            dayRangeHeaderFormat: (
                { start, end }: { start: Date; end: Date },
                culture?: Culture,
                localizer?: DateLocalizer
            ) => {
                const s = localizer?.format(start, 'dd/MM/yyyy', culture)
                const e = localizer?.format(end, 'dd/MM/yyyy', culture)
                return `${s} - ${e}`
            }
        }),
        []
    )

    useEffect(() => {
        return () => {
            if (clickRef.current) {
                window.clearTimeout(clickRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (getClassMutation.data) {
            const newEvents = getClassMutation.data.map((item) => {
                return new EventType(
                    `${item.classroom.name} - ${item.classTeachers.map((teacher) => teacher.teacher.name).join(', ')} - ${item.classStatus.name
                    }`,
                    false,
                    new Date(item.startTime),
                    new Date(item.endTime),
                    item
                )
            })

            const newListEvents = events.concat(newEvents)
            setEvents(newListEvents)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getClassMutation.data])

    //onSelectSlot
    const onSelectSlot = useCallback(
        (slotInfo: SlotInfo) => {
            // form.resetFields()
            if (clickRef.current) {
                window.clearTimeout(clickRef.current)
            }
            clickRef.current = window.setTimeout(() => {
                if (slotInfo.start.toLocaleDateString() < new Date().toLocaleDateString()) {
                    return notificationApi.error({
                        message: 'Không thể tạo lịch học cho ngày đã qua'
                    })
                }
                setSelectedEvent(null)
                form.setFieldsValue({
                    startTime: dayjs(slotInfo.start),
                    endTime: dayjs(slotInfo.end),
                    classroomId: '',
                    statusId: 1,
                    classTeachers: []
                })
                setIsModalOpen(true)
            }, 250)
        },
        [notificationApi, form]
    )

    const handleNavigate = (date: Date) => {
        if (gotWeek.includes(dayjs(date).startOf('week').unix())) {
            return
        }

        setClassQuery({
            startDate: dayjs(date).startOf('week').format('YYYY-MM-DD'),
            endDate: dayjs(date).endOf('week').add(1, 'day').format('YYYY-MM-DD')
        })

        setGotWeek((prev) => {
            return prev.concat(dayjs(date).startOf('week').unix())
        })
    }

    // const handleDelete

    const defaultDate = useMemo(() => new Date(), [])

    return (
        <div>
            {notificationContextHolder}
            <Calendar
                onNavigate={(date) => {
                    // console.log('date', date)
                    // console.log('view', view)
                    handleNavigate(date)
                }}
                defaultView={Views.WEEK}
                views={[Views.WEEK, Views.DAY, Views.AGENDA]}
                onView={() => { }} // This is a dummy function to prevent the warning
                defaultDate={defaultDate}
                localizer={localizer}
                events={events}
                // startAccessor="start"="ignoreEvents"
                // endAccessor="end"
                style={{ height: 1200 }}
                culture={'vi'}
                dayPropGetter={(date) => {
                    // Disable from last day
                    if (date.toLocaleDateString() < new Date().toLocaleDateString()) {
                        return {
                            className: 'opacity-50'
                        }
                    } else {
                        return {
                            className: ''
                        }
                    }
                }}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                selectable
                formats={formats}
                timeslots={3}
            />
            {/* Create Event Modal */}
            <Modal
                title={selectedEvent ? 'Cập nhật lịch học' : 'Tạo lịch học'}
                // onOk={handleSubmit}
                onCancel={() => {
                    setIsModalOpen(false)
                    setSelectedEvent(null)
                }}
                // okText='Lưu'
                // cancelText='Hủy'
                open={isModalOpen}
                maskClosable={true}
                destroyOnClose={true}
                width={1200}
                // className='bg-[#fafcfe]'
                footer={null}
            >
                <div className='grid grid-cols-2 grid-flow-row gap-x-4'>
                    <Form
                        form={form}
                        layout='vertical'
                        onFinish={handleSubmit}
                        className={`grid grid-flow-row gap-x-4 ${selectedEvent !== null && selectedEvent?.resource?.classStatus.id !== 1
                                ? 'col-span-1 border-r border-gray-200 pr-4'
                                : 'col-span-2'
                            }`}
                        disabled={selectedEvent !== null && selectedEvent?.resource?.classStatus.id !== 1}
                    >
                        <Form.Item<FormType>
                            name='classroomId'
                            label='Phòng học'
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    transform: (value) => value.trim(),
                                    message: 'Vui lòng chọn phòng học'
                                }
                            ]}
                            className='col-span-2'
                        >
                            <Select
                                // style={{ width: '100%' }}
                                placeholder='Chọn phòng học'
                                options={getClassroomQuery.data?.map((classroom) => ({
                                    label: classroom.name,
                                    value: classroom.id
                                }))}
                            />
                        </Form.Item>

                        <Form.Item<FormType>
                            name='startTime'
                            label='Thời gian bắt đầu'
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    transform: (value) => value.trim(),
                                    message: 'Vui lòng chọn thời gian'
                                }
                            ]}
                            className='col-span-1'
                        >
                            <DatePicker
                                // defaultValue={dayjs(selectedSlot?.start)} // Set the default date
                                showTime
                                locale={buddhistLocale}
                            />
                        </Form.Item>

                        <Form.Item<FormType>
                            name='endTime'
                            label='Thời gian kết thúc'
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    transform: (value) => value.trim(),
                                    message: 'Vui lòng chọn thời gian'
                                }
                            ]}
                            className='col-span-1'
                        >
                            <DatePicker
                                // defaultValue={dayjs(selectedSlot?.end)}
                                showTime
                                locale={buddhistLocale}
                            />
                        </Form.Item>

                        {
                            // suggestion: Tag for time slots
                            getTimeSlotsQuery.data && (
                                <div className='col-span-2 mb-4'>
                                    <h1 className='text-xs italic font-medium mb-2 text-gray-500'>Gợi ý thời gian</h1>
                                    <div className='flex flex-wrap gap-2'>
                                        {getTimeSlotsQuery.data.map((timeSlot) => (
                                            <Tag
                                                key={timeSlot.id}
                                                onClick={() => {
                                                    form.setFieldsValue({
                                                        startTime: dayjs(
                                                            form.getFieldValue('startTime').format('YYYY-MM-DD') + ' ' + timeSlot.start
                                                        ),
                                                        endTime: dayjs(form.getFieldValue('endTime').format('YYYY-MM-DD') + ' ' + timeSlot.end)
                                                    })
                                                }}
                                                bordered={false}
                                                color='processing'
                                                className='cursor-pointer'
                                            >
                                                {timeSlot.start} - {timeSlot.end}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        <Form.Item<FormType>
                            name='classTeachers'
                            label='Giáo viên'
                            className='col-span-2'
                            rules={[
                                {
                                    required: true,
                                    type: 'array',
                                    message: 'Vui lòng chọn giáo viên'
                                }
                            ]}
                        >
                            <Select
                                mode='multiple'
                                allowClear
                                placeholder='Chọn giáo viên'
                                // disabled={[3, 4].includes(selectedEvent?.resource?.classStatus.id || 1) ? true : false}
                                options={getTeachersQuery.data?.data.map((teacher) => ({
                                    label: teacher.name,
                                    value: teacher.id
                                }))}
                            />
                        </Form.Item>

                        <Form.Item<FormType>
                            name='statusId'
                            label='Trạng thái'
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    transform: (value) => value.trim(),
                                    message: 'Vui lòng chọn trạng thái'
                                }
                            ]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                placeholder='Chọn trạng thái'
                                disabled={selectedEvent ? [3, 4].includes(selectedEvent.resource?.classStatus.id || 1) : false}
                                options={getClassStatusesQuery.data?.map((status) => ({
                                    label: status.name,
                                    value: status.id
                                }))}
                            />
                        </Form.Item>

                        <Form.Item<FormType> name='description' label='Ghi chú' className='col-span-2'>
                            <Input placeholder='Ghi chú' style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item className='col-span-2'>
                            <Button
                                type='primary'
                                htmlType='submit'
                                loading={patchClassMutation.isPending || postClassMutation.isPending}
                                disabled={false}
                            >
                                Hoàn thành
                            </Button>

                            {selectedEvent && (
                                <Popconfirm
                                    title='Bạn có chắc chắn muốn xóa lịch học này không?'
                                    onConfirm={handleDeleteClass}
                                    okText='Có'
                                    cancelText='Không'
                                >
                                    <Button type='primary' danger className='ml-2' loading={deleteClassMutation.isPending}>
                                        Xóa
                                    </Button>
                                </Popconfirm>
                            )}
                        </Form.Item>
                    </Form>

                    {/* Section to add student when class status = 3 */}
                    {selectedEvent && selectedEvent?.resource?.classStatus.id !== 1 && (
                        <div className='col-span-1'>
                            {/* Seleceted Student*/}
                            <div className=''>
                                <h1 className='text-xs italic font-medium mb-2 text-gray-500'>Danh sách học viên</h1>
                                <InfiniteScroll
                                    dataLength={getStudentTimeSlotsQuery.data?.meta.itemCount || 0}
                                    hasMore={getStudentTimeSlotsQuery.data?.meta.hasPreviousPage || false}
                                    loader={<Spin />}
                                    height='100%'
                                    next={() => {
                                        setStudentQuery((prevQuery) => ({
                                            ...prevQuery,
                                            page: prevQuery.page + 1
                                        }))
                                    }}
                                    children={
                                        <List
                                            dataSource={getStudentTimeSlotsQuery.data?.data}
                                            renderItem={(item) => (
                                                <List.Item
                                                    key={item.id}
                                                    actions={[
                                                        <Button
                                                            type={
                                                                getClassStudentsQuery.data?.data.map((student) => student.student.id).includes(item.id)
                                                                    ? 'primary'
                                                                    : 'default'
                                                            }
                                                            icon={<ScheduleOutlined />}
                                                            onClick={() => {
                                                                handleAddStudent(item.id)
                                                            }}
                                                            disabled={!item.courseId}
                                                        ></Button>
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        title={
                                                            <Link target='blank' to={`/student/${item.id}`}>
                                                                {item.name}
                                                            </Link>
                                                        }
                                                        avatar={<Avatar src={item.avatar ?? ''} />}
                                                        description={`Đang học: ${item.course?.name ?? 'Chưa đăng kí'}`}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    }
                                ></InfiniteScroll>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}
