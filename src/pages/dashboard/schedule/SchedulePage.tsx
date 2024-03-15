import { Calendar, SlotInfo, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import './SchedulePage.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DatePicker, Form, Input, Modal, Select, TimePicker } from 'antd'
import { useGetClasssStatusesQuery } from '~/stores/server/class/classStatusStore'
import { useGetTeachersQuery } from '~/stores/server/teacher/teacherStore'
import { PostClassRequestBodyType } from '~/types/class/classType'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useGetClassroomsQuery } from '~/stores/server/classroom/classroomStore'

type FormType = PostClassRequestBodyType

const locales = {
    'en-US': enUS,
}


const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const FORM_INITIAL_VALUES: FormType = {
    startTime: '',
    endTime: '',
    classroomId: '',
    statusId: 1,
    classTeachers: []
}

export const SchedulePage = () => {

    const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    // const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()])
    // const [timeRange, setTimeRange] = useState<[Date, Date]>([new Date(), new Date()])

    const getClassStatusesQuery = useGetClasssStatusesQuery()
    const getTeachersQuery = useGetTeachersQuery()
    const getClassroomQuery = useGetClassroomsQuery()

    const [form] = useForm<FormType>()

    useEffect(() => {
        form.setFieldsValue(FORM_INITIAL_VALUES)
    }, [form])

    const myEventsList = [
        {
            title: 'All Day Event very long title',
            allDay: true,
            start: new Date(2024, 3, 0),
            end: new Date(2024, 3, 1),
        },
        {
            title: 'Long Event',
            start: new Date(2024, 3, 7),
            end: new Date(2024, 3, 10),
        },

        {
            title: 'DTS STARTS',
            start: new Date(2024, 2, 13, 0, 0, 0),
            end: new Date(2024, 2, 20, 0, 0, 0),
        },

        {
            title: 'DTS ENDS',
            start: new Date(2024, 10, 6, 0, 0, 0),
            end: new Date(2024, 10, 13, 0, 0, 0),
        },

        {
            title: 'Some Event',
            start: new Date(2024, 3, 9, 0, 0, 0),
            end: new Date(2024, 3, 9, 0, 0, 0),
        },
        {
            title: 'Conference',
            start: new Date(2024, 3, 11),
            end: new Date(2024, 3, 13),
            desc: 'Big conference for important people',
        },
        {
            title: 'Meeting',
            start: new Date(2024, 3, 12, 10, 30, 0, 0),
            end: new Date(2024, 3, 12, 12, 30, 0, 0),
            desc: 'Pre-meeting meeting, to prepare for the meeting',
        },
        {
            title: 'Lunch',
            start: new Date(2024, 3, 12, 12, 0, 0, 0),
            end: new Date(2024, 3, 12, 13, 0, 0, 0),
            desc: 'Power lunch',
        },
    ]

    const handleSubmit = async () => {
    }

    const clickRef = useRef(null as number | null)


    useEffect(() => {
        /**
         * What Is This?
         * This is to prevent a memory leak, in the off chance that you
         * teardown your interface prior to the timed method being called.
         */
        return () => {
            if (clickRef.current) {
                window.clearTimeout(clickRef.current as number)
            }
        }
    }, [])

    const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
        /**
         * Here we are waiting 250 milliseconds (use what you want) prior to firing
         * our method. Why? Because both 'click' and 'doubleClick'
         * would fire, in the event of a 'doubleClick'. By doing
         * this, the 'click' handler is overridden by the 'doubleClick'
         * action.
         */
        if (clickRef.current) {
            window.clearTimeout(clickRef.current)
        }
        clickRef.current = window.setTimeout(() => {
            setSelectedSlot(slotInfo)
            setIsModalOpen(true)
        }, 250)
    }, [])

    // const onSelecting = useCallback((range: unknown) => {
    //     /**
    //      * Here we are waiting 250 milliseconds (use what you want) prior to firing
    //      * our method. Why? Because both 'click' and 'doubleClick'
    //      * would fire, in the event of a 'doubleClick'. By doing
    //      * this, the 'click' handler is overridden by the 'doubleClick'
    //      * action.
    //      */
    //     window.clearTimeout(clickRef?.current)
    //     clickRef.current = window.setTimeout(() => {
    //         console.log('onSelecting range', range)
    //     }, 250)
    // }, [])

    const defaultDate = useMemo(() => new Date(), [])

    return (
        <div>
            <Calendar
                view='week'
                onView={() => { }} // This is a dummy function to prevent the warning
                defaultDate={defaultDate}
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 800 }}
                // onSelecting={
                //     onSelecting
                // }
                onSelectSlot={
                    onSelectSlot
                }
                selectable
            />
            {/* Create Event Modal */}
            <Modal
                title='Thêm mới lịch học'
                onOk={() => { }}
                onCancel={() => {
                    setIsModalOpen(false)
                }}
                okText='Lưu'
                cancelText='Hủy'
                open={isModalOpen}
                maskClosable={false}
                destroyOnClose={true}
                width={
                    800
                }
            >
                <Form
                    form={form}
                    initialValues={FORM_INITIAL_VALUES}
                    layout='vertical'
                    onFinish={handleSubmit}
                    className='grid grid-cols-3 grid-flow-row gap-x-4'
                >
                    <Form.Item
                        label='Ngày'
                    >
                        <DatePicker.RangePicker
                            format='DD/MM/YYYY'
                            showTime
                            style={{ width: '100%' }}
                            defaultValue={
                                [selectedSlot?.start ? dayjs(selectedSlot.start) : null, selectedSlot?.end ? dayjs(selectedSlot.end) : null]
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label='Thời gian'
                    >
                        <TimePicker.RangePicker
                            format='HH:mm'
                            style={{ width: '100%' }}
                            name='endTime'
                            defaultValue={
                                [selectedSlot?.start ? dayjs(selectedSlot.start) : null, selectedSlot?.end ? dayjs(selectedSlot.end) : null]
                            }
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

                    <Form.Item
                        name='teacherIds'
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

                    <Form.Item
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