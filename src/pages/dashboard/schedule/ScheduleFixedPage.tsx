import { Button, Popconfirm, Table } from "antd"
import dayjs from "dayjs"
import buddhistEra from "dayjs/plugin/buddhistEra"
import { useEffect, useMemo, useState } from "react"
import { useGetTimeSlotsQuery } from "~/stores/server/timeSlot/timeSlotStore"
import { daysOfWeek } from "~/utils/daysOfWeek"
import viDayjs from "dayjs/locale/vi"
// import { ColumnsType } from "antd/es/table"
import { ClassSampleType, PostClassSampleRequestBodyType } from "~/types/class/classSampleType"
import { useGetClassSampleQuery, usePostClassSampleMutation } from "~/stores/server/class/classSampleStore"
import useNotification from "antd/es/notification/useNotification"

dayjs.extend(buddhistEra)
dayjs.locale(viDayjs)

export const ScheduleFixedPage = () => {

    const [notificationApi, notificationContextHolder] = useNotification()

    const [classSample, setClassSample] = useState<Array<ClassSampleType>>([])
        
    const getTimeSlotQuery = useGetTimeSlotsQuery()

    const getClassSampleQuery = useGetClassSampleQuery()

    const postMutation = usePostClassSampleMutation()

    useEffect(() => {
        if (!getClassSampleQuery.data) {
            return
        }

        setClassSample(getClassSampleQuery.data || [])

    }, [getClassSampleQuery.data])

    const handleSave = async () => {

        if (!sessionStorage.getItem('branchId')) {
            notificationApi.error({
                message: 'Lưu thất bại',
                description: 'Dữ liệu lịch học cố định chưa được lưu'
            })
        }

        const requestBody: PostClassSampleRequestBodyType[] = classSample.map((classItem) => {
            return {
                branchId: sessionStorage.getItem('branchId') ? parseInt(sessionStorage.getItem('branchId') as string) : 1,
                timeSlotId: classItem.timeSlotId,
                dayOfWeekId: classItem.dayOfWeekId,
            }
        })

        try {
            await postMutation.mutateAsync(requestBody)
            
            notificationApi.success({
                message: 'Lưu thành công',
                description: 'Dữ liệu lịch học cố định đã được lưu'
            })

        } catch (error) {
            notificationApi.error({
                message: 'Lưu thất bại',
                description: 'Dữ liệu lịch học cố định chưa được lưu'
            })
        }
    }

    const columns = [
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
            render: (text: string) => <span>{text}</span>,
        },
        ...daysOfWeek.map((day) => ({
            title: day.label,
            dataIndex: day.value,
            key: day.value,
            width: '10%',
            render: (text: number, _record: unknown, _index: number) => {
                return <div
                    className={`${text === 0 ? 'bg-gray-100' : 'bg-[#fdd247]'} h-10`}
                    onClick={() => {

                        console.log('day', day.value, 'time', _index)

                        const newClassSample = classSample.filter((classItem) => {
                            return classItem.dayOfWeekId !== day.value || classItem.timeSlotId !== (getTimeSlotQuery.data ? getTimeSlotQuery.data[_index].id : 1)
                        })

                        if (text === 0) {
                            setClassSample([
                                ...newClassSample,
                                {
                                    timeSlotId: getTimeSlotQuery.data ? getTimeSlotQuery.data[_index].id : 1,
                                    dayOfWeekId: day.value,
                                    branchId: sessionStorage.getItem('branchId') ? parseInt(sessionStorage.getItem('branchId') as string) : 1,
                                }
                            ])
                        } else {
                            setClassSample(newClassSample)
                        }
                    }}
                ></div>
            }
        })),
    ]

    const tableData = useMemo(() => {
        if (!getTimeSlotQuery.data) {
            return []
        }

        type TempType = {
            time: string;
            [key: number]: number;
        };

        const temp: TempType[] = getTimeSlotQuery.data.map((timeSlot) => {
            const tempItem: TempType = {
                time: `${timeSlot.start} - ${timeSlot.end}`,
            };
            for (let i = 0; i < 7; i++) {
                tempItem[i] = 0;
            }
            return tempItem;
        });

        console.log('temp', temp)
        console.log('classSample', classSample)

        
        classSample.forEach((classItem) => {
            // console.log(getTimeSlotQuery.data.findIndex((timeSlot) => timeSlot.id === classItem.timeSlotId))
            temp[getTimeSlotQuery.data.findIndex((timeSlot) => timeSlot.id === classItem.timeSlotId)][classItem.dayOfWeekId] = 1;
        });

        return temp

    }, [classSample, getTimeSlotQuery.data])

    return (
        <div>
            {notificationContextHolder}

            <h1 className='text-lg semibold'>
                Lịch học cố định theo tuần
            </h1>

            <div className='flex justify-end mt-4 mb-4'>
                <Popconfirm
                    title='Bạn có chắc chắn muốn lưu không?'
                    onConfirm={() => {
                        handleSave()
                    }}
                    okText='Có'
                    cancelText='Không'
                >
                    <Button
                        type='primary'
                    >
                        Lưu
                    </Button>
                </Popconfirm>
            </div>

            <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                rowKey={(record) => record.time}
            />

            
        </div>
    )
}