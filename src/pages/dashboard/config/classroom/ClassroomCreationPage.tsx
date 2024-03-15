/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Form, Input, Select, notification } from 'antd'
import { PostClassroomRequestBodyType } from '~/types/classroom/classroomType'
import { useGetClassroomByIdQuery, usePatchClassroomMutation, usePostClassroomMutation } from '~/stores/server/classroom/classroomStore'
import { useGetBranchQuery } from '~/stores/server/branch/branchStore'

type FormType = PostClassroomRequestBodyType

const FORM_INITIAL_VALUES: FormType = {
    name: '',
    room: '',
    branchId: '',
    status: 1
}

const ClassroomCreationPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [form] = Form.useForm<FormType>()
    const [notificationApi, notificationContextHolder] = notification.useNotification()

    // Stores
    const getBrachQuery = useGetBranchQuery()
    // const postUploadFilesMutation = usePostUploadFilesMutation()
    const getByIdQuery = useGetClassroomByIdQuery({
        id: id ?? ''
    })
    // const getAccountByIdQuery = useGetAccountByIdQuery({
    //     id: id ?? ''
    // })
    // const postAccountMutation = usePostAccountMutation()
    // const patchAccountMutation = usePatchAccountMutation()
    const postMutation = usePostClassroomMutation()
    const patchMutation = usePatchClassroomMutation()

    const handleSubmit = async () => {
        try {
            form.validateFields()
            const formValues = form.getFieldsValue()

            if (id) {
                const requestBody: FormType = {
                    name: formValues.name,
                    room: formValues.room,
                    branchId: formValues.branchId,
                    status: formValues.status
                }
                await patchMutation.mutateAsync({
                    id,
                    requestBody
                })
            }
            else {
                const requestBody: FormType = {
                    name: formValues.name,
                    room: formValues.room,
                    branchId: formValues.branchId,
                    status: formValues.status
                }
                await postMutation.mutateAsync(requestBody)
            }

            notificationApi.success({
                message: 'Thao tác thành công'
            })

            return navigate('/config/classroom')
        } catch (error) {
            return notificationApi.error({
                message: 'Thao tác thất bại'
            })
        }
    }

    //   Effects
    useEffect(() => {
        if (!getByIdQuery.data) {
            return
        }

        form.setFieldsValue({
            name: getByIdQuery.data.name,
            room: getByIdQuery.data.room,
            branchId: getByIdQuery.data.branchId,
            status: getByIdQuery.data.status
        })

    }, [form, getByIdQuery.data])

    return (
        <div className='flex flex-col items-start'>
            {notificationContextHolder}

            <h1 className='text-xl font-medium mb-4'>{id ? 'Thông tin khóa học' : 'Thêm mới khóa học'}</h1>

            <Form
                form={form}
                initialValues={FORM_INITIAL_VALUES}
                layout='vertical'
                onFinish={handleSubmit}
                className='grid lg:grid-cols-3 md:grid-cols-2 grid-flow-row gap-x-4'
            >

                <Form.Item<FormType>
                    name='name'
                    label='Tên phòng học'
                    rules={[
                        { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên phòng học' }
                    ]}
                >
                    <Input placeholder='Tên khóa học' />
                </Form.Item>

                <Form.Item<FormType>
                    name='room'
                    label='Phòng học'
                    rules={[
                        { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập phòng học' }
                    ]}
                >
                    <Input placeholder='Phòng học' />
                </Form.Item>

                <Form.Item<FormType>
                    name='branchId'
                    label='Chi nhánh'
                    rules={[
                        { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng chọn chi nhánh' }
                    ]}
                >
                    <Select
                        placeholder='Chọn chi nhánh'
                        allowClear
                        showSearch
                        optionFilterProp='children'
                        options={getBrachQuery.data?.map((branch) => ({
                            label: branch.name,
                            value: branch.id
                        }))}
                    />
                </Form.Item>
            
                <Form.Item<FormType> name='status' valuePropName='checked'>
                    <Checkbox
                     defaultChecked={true}>Kích hoạt</Checkbox>
                </Form.Item>
            </Form>

            <Button
                type='primary'
                className='self-start'
                loading={postMutation.isPending || patchMutation.isPending}
                onClick={() => form.submit()}
            >
                Hoàn thành
            </Button>
        </div>
    )
}

export default ClassroomCreationPage
