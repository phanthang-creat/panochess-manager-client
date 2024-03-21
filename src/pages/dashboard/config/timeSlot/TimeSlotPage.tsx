/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { Button, Form, Modal, Table, TimePicker, notification } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useDeleteTimeSlotMutation, useGetTimeSlotsQuery, usePatchTimeSlotMutation, usePostTimeSlotMutation } from '~/stores/server/timeSlot/timeSlotStore'
import { GetTimeSlotQueryItemResponseDataType, PatchTimeSlotRequestBodyType, PostTimeSlotRequestBodyType } from '~/types/timeSlot/timeSlotType'
import { Dayjs } from 'dayjs'

type FormType = {
  start: Dayjs
  end: Dayjs

}

const TimeSlotPage = () => {
  // const navigate = useNavigate()
  const [notificationApi, notificationContextHolder] = notification.useNotification()

  // States
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const getQuery = useGetTimeSlotsQuery()
  const [isOpenCreationModal, setIsOpenCreationModal] = useState<boolean>(false)
  const [form] = Form.useForm<FormType>()
  const deleteCourseMutation = useDeleteTimeSlotMutation()
  const postMutation = usePostTimeSlotMutation()
  const patchMutation = usePatchTimeSlotMutation()
  const [selectedItem, setSelectedItem] = useState<GetTimeSlotQueryItemResponseDataType | null>(null)

  // Constants
  const columns: ColumnsType<GetTimeSlotQueryItemResponseDataType> = [
    {
      key: 'index',
      dataIndex: 'index',
      title: 'STT',
      width: '10%'
    },
    {
      key: 'start',
      dataIndex: 'start',
      title: 'Bắt đầu',
      width: '25%'
    },
    {
      key: 'end',
      dataIndex: 'end',
      title: 'Kết thúc',
      width: '25%'
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: 'Hành động',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-2'>
          <Button
            shape='circle'
            icon={<EditOutlined />}
            onClick={() => handleUpdateMenu(record)}
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

  // Methods
  const handleDeleteMenu = async () => {
    try {
      if (!selectedItemId) {
        return
      }
      await deleteCourseMutation.mutateAsync(selectedItemId)
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

  const handleSubmit = async () => {
    const validation = await form.validateFields(
      ['start', 'end']
    )
    if (validation) {
      if (!form.getFieldsError().filter(({ errors }) => errors.length).length)

      if (selectedItem) {
        try {
          const formValues = form.getFieldsValue()
          const requestBody: PatchTimeSlotRequestBodyType = {
            start: formValues.start.format('HH:mm:ss') === selectedItem.start ? undefined : formValues.start.format('HH:mm'),
            end: formValues.end.format('HH:mm:ss') === selectedItem.end ? undefined : formValues.end.format('HH:mm')
          }
          await patchMutation.mutateAsync({
            id: selectedItem.id,
            requestBody
          })
          setIsOpenCreationModal(false)
          return notificationApi.success({
            message: 'Thao tác thành công'
          })
        } catch (error) {
          return notificationApi.error({
            message: 'Thao tác thất bại'
          })
        }
      }

      try {
        const formValues = form.getFieldsValue()
        const requestBody: PostTimeSlotRequestBodyType = {
          start: formValues.start.format('HH:mm'),
          end: formValues.end.format('HH:mm')
        }
        setIsOpenCreationModal(false)
        await postMutation.mutateAsync(requestBody)
        return notificationApi.success({
          message: 'Thao tác thành công'    
        })
      } catch (error) {
        return notificationApi.error({
          message: 'Thao tác thất bại'
        })
      }
    } else {
      return notificationApi.error({
        message: 'Thao tác thất bại'
      })
    }
  }

  const handleUpdateMenu = (record: GetTimeSlotQueryItemResponseDataType) => {
    setSelectedItem(record)
    setIsOpenCreationModal(true)
  }

  // Memos
  const tableData = useMemo(
    () =>
      Array.isArray(getQuery.data)
        ? getQuery.data.map((item, index) => ({ ...item, index: index + 1, key: item.id, }))
        : [],
    [getQuery.data]
  )

  // Template
  return (
    <div>
      {notificationContextHolder}

      <h1 className='text-xl font-medium'>Quản lý khung giờ</h1>

      <div className='flex flex-col items-start gap-4'>
        <Button type='primary' className='self-end' onClick={() => setIsOpenCreationModal(true)}>
          Thêm mới
        </Button>
        {/* Table */}
        <Table
          className='w-full'
          columns={columns}
          dataSource={tableData}
          bordered
          loading={getQuery.isLoading}
        />
      </div>

      <Modal
        title={'Xóa thông tin'}
        open={isOpenConfirmDeleteModal}
        maskClosable={false}
        okText='Xóa'
        cancelText='Hủy'
        onOk={handleDeleteMenu}
        confirmLoading={deleteCourseMutation.isPending}
        onCancel={handleCancelDeleting}
      >
        <div>Hành động này không thể khôi phục. Bạn chắc chắn muốn xóa thông tin này?</div>
      </Modal>
      <Modal
        title={'Thêm mới khung giờ'}
        open={isOpenCreationModal}
        maskClosable={false}
        okText='Hoàn thành'
        cancelText='Hủy'
        // onOk={() => navigate('/config/classroom/creation')}
        onOk={() => form.submit()}
        onCancel={() => setIsOpenCreationModal(false)}
      >
        <div>
          <Form
            form={form}
            initialValues={{}}
            layout='vertical'
            onFinish={handleSubmit}
            className='grid lg:grid-cols-3 md:grid-cols-2 grid-flow-row gap-x-4'
          >
            <Form.Item<FormType>
              name='start'
              label='Bắt đầu'
              rules={[
                { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng chọn thời gian bắt đầu' }
              ]}
              
            >
              <TimePicker
                placeholder='Bắt đầu' 
                format={'HH:mm'}
              />
            </Form.Item>

            <Form.Item<FormType>
              name='end'
              label='Kết thúc'
              rules={[
                { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng chọn thời gian kết thúc' }
              ]}
            >
              <TimePicker 
                placeholder='Kết thúc'
                format={'HH:mm'}

              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default TimeSlotPage
