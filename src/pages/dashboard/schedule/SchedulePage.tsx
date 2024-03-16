import { Calendar, Culture, DateLocalizer, SlotInfo, Views, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { vi } from 'date-fns/locale/vi'
// import en from 'date-fns/locale/en-US'
import './SchedulePage.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DatePicker, Form, Input, Modal, Select } from 'antd'
import { useGetClasssStatusesQuery } from '~/stores/server/class/classStatusStore'
import { useGetTeachersQuery } from '~/stores/server/teacher/teacherStore'
import { GetClassQueryItemResponseDataType, PatchClassRequestBodyType, PostClassRequestBodyType } from '~/types/class/classType'
import dayjs, { Dayjs } from 'dayjs'
import { useGetClassroomsQuery } from '~/stores/server/classroom/classroomStore'
import { useGetClassesQuery, usePatchClassMutation, usePostClassMutation } from '~/stores/server/class/classStore'
import useNotification from 'antd/es/notification/useNotification'
import { Day } from 'node_modules/date-fns/types'
// import FormItem from 'antd/es/form/FormItem'
import buddhistEra from 'dayjs/plugin/buddhistEra';
import viPicker from 'antd/es/date-picker/locale/vi_VN'
import { compareArrays } from '~/utils/compareArrays'

dayjs.extend(buddhistEra)

interface FormType {
    startTime: Dayjs
    endTime: Dayjs
    classroomId: string
    statusId: number
    classTeachers: string[]
    description?: string
}

const locales = {
    'vi': vi
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
        rangePlaceholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
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
    locales,
})

class EventType {
    constructor(title: string, allDay: boolean, start: Date, end: Date, resource?: GetClassQueryItemResponseDataType) {
        this.title = title
        this.allDay = allDay ?? false
        this.start = start
        this.end = end,
        this.resource = resource
    }

    title: string
    allDay: boolean = false
    start: Date
    end: Date
    resource?: GetClassQueryItemResponseDataType
}

export const SchedulePage = () => {

    const [notificationApi, notificationContextHolder] = useNotification()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [events, setEvents] = useState<EventType[]>([])
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
    const getClassStatusesQuery = useGetClasssStatusesQuery()
    const getTeachersQuery = useGetTeachersQuery()
    const getClassroomQuery = useGetClassroomsQuery()
    const postClassMutation = usePostClassMutation()
    const patchClassMutation = usePatchClassMutation()
    const getClassMutation = useGetClassesQuery()

    const [form] = Form.useForm<FormType>()

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
                startTime: formValues.startTime.unix() !== (selectedEvent.start.getTime() / 1000) ? formValues.startTime.toString() : undefined,
                endTime: formValues.endTime.unix() !== (selectedEvent.end.getTime() / 1000) ? formValues.endTime.toString() : undefined,
                classroomId: formValues.classroomId !== selectedEvent.resource.classroom.id ? formValues.classroomId : undefined,
                statusId: formValues.statusId !== selectedEvent.resource.classStatus.id ? formValues.statusId : undefined,
                // compare with the previous list of teachers
                classTeachers: compareArrays(
                    listTeachers.map((teacher) => teacher.teacherId),
                    selectedEvent.resource.classTeachers.map((teacher) => teacher.teacher.id)) ? undefined : listTeachers, 
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
                statusId: formValues.statusId,
                classTeachers: listTeachers
            }

            try {
                await postClassMutation.mutateAsync(requestBody)
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
        setIsModalOpen(true)
    }

    const formats = useMemo(() => ({
        dateFormat: 'dd',
        dayFormat: (date: Date, culture?: Culture, localizer?: DateLocalizer) => {
            return (vi.localize.day(date.getDay() as Day, { width: 'short' })) + ' ' + localizer?.format(date, 'dd/MM', culture)
        },
        dayRangeHeaderFormat: ({ start, end }: { start: Date, end: Date }, culture?: Culture, localizer?: DateLocalizer) => {
            const s = localizer?.format(start, 'dd/MM/yyyy', culture)
            const e = localizer?.format(end, 'dd/MM/yyyy', culture)
            return `${s} - ${e}`
        },
    }), [])

    const clickRef = useRef(0)

    useEffect(() => {
        return () => {
            if (clickRef.current) {
                window.clearTimeout(clickRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (getClassMutation.data) {
            const events = getClassMutation.data.map((item) => {
                return new EventType(
                    `${item.classroom.name} - ${item.classTeachers.map((teacher) => teacher.teacher.name).join(', ')} - ${item.classStatus.name}`,
                    false,
                    new Date(item.startTime),
                    new Date(item.endTime),
                    item
                )
            })
            setEvents(events)
        }
    }, [getClassMutation.data])

    //onSelectSlot
    const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
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
    }, [
        notificationApi, form
    ])

    const defaultDate = useMemo(() => new Date(), [])

    return (
        <div>
            {notificationContextHolder}
            <Calendar
                // view='week'
                defaultView={Views.WEEK}
                onView={() => { }} // This is a dummy function to prevent the warning
                defaultDate={defaultDate}
                localizer={localizer}
                events={events}
                // startAccessor="start"="ignoreEvents"
                // endAccessor="end"
                style={{ height: 800 }}
                culture={'vi'}
                dayPropGetter={(date) => {
                    // Disable from last day
                    if (date.toLocaleDateString() < new Date().toLocaleDateString()) {
                        return {
                            className: 'bg-gray-100'
                        }
                    } else {
                        return {
                            className: ''
                        }
                    }
                }}
                onSelectEvent={onSelectEvent}
                onSelectSlot={
                    onSelectSlot
                }
                selectable
                formats={formats}

            />
            {/* Create Event Modal */}
            <Modal
                title={selectedEvent ? 'Cập nhật lịch học' : 'Tạo lịch học'}
                onOk={handleSubmit}
                onCancel={() => {
                    setIsModalOpen(false)
                    setSelectedEvent(null)
                }}
                okText='Lưu'
                cancelText='Hủy'
                open={isModalOpen}
                maskClosable={false}
                destroyOnClose={true}
                width={800}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleSubmit}
                    className='grid grid-cols-3 grid-flow-row gap-x-4'
                >

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
                    >
                        <DatePicker
                            // defaultValue={dayjs(selectedSlot?.end)}
                            showTime
                            locale={buddhistLocale}
                        />
                    </Form.Item>

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
                    >
                        <Select
                            style={{ width: '100%' }}
                            placeholder='Chọn phòng học'
                            options={
                                getClassroomQuery.data?.map((classroom) => ({
                                    label: classroom.name,
                                    value: classroom.id,
                                }))
                            }
                        />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='classTeachers'
                        label='Giáo viên'
                        className='col-span-3'
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
                            options={
                                getTeachersQuery.data?.data.map((teacher) => ({
                                    label: teacher.name,
                                    value: teacher.id
                                }))
                            }
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
                            options={
                                getClassStatusesQuery.data?.map((status) => ({
                                    label: status.name,
                                    value: status.id
                                }))
                            }
                        />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='description'
                        label='Ghi chú'
                        className='col-span-2'
                    >
                        <Input
                            placeholder='Ghi chú'
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}