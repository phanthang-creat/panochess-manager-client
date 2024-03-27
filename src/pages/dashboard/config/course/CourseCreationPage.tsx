/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Form, Input, InputNumber, notification } from 'antd'
import { PostCourseRequestBodyType, PatchCourseRequestBodyType } from '~/types/course/courseType'
import { useGetCourseByIdQuery, usePatchCourseMutation, usePostCourseMutation } from '~/stores/server/course/courseStore'

const FORM_INITIAL_VALUES: PostCourseRequestBodyType = {
    name: '',
    description: '',
    numberOfSessions: 0,
    price: 0,
    status: 1
}

const CourseCreationPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [form] = Form.useForm<PostCourseRequestBodyType>()
    const [notificationApi, notificationContextHolder] = notification.useNotification()

    // Stores
    // const getBrachQuery = useGetBranchQuery()
    // const postUploadFilesMutation = usePostUploadFilesMutation()
    const getCourseByIdQuery = useGetCourseByIdQuery({
        id: id ?? ''
    })
    // const getAccountByIdQuery = useGetAccountByIdQuery({
    //     id: id ?? ''
    // })
    // const postAccountMutation = usePostAccountMutation()
    // const patchAccountMutation = usePatchAccountMutation()
    const postCourseMutation = usePostCourseMutation()
    const patchCourseMutation = usePatchCourseMutation()

    const handleSubmit = async () => {
        try {
            form.validateFields()
            const formValues = form.getFieldsValue()

            if (id) {
                const requestBody: PatchCourseRequestBodyType = {
                    name: formValues.name,
                    price: formValues.price,
                    numberOfSessions: formValues.numberOfSessions,
                    description: formValues.description,
                    status: formValues.status ? 1 : 0
                }
                await patchCourseMutation.mutateAsync({
                    id,
                    requestBody
                })
            }
            else {
                const requestBody: PostCourseRequestBodyType = {
                    name: formValues.name,
                    price: formValues.price,
                    numberOfSessions: formValues.numberOfSessions,
                    description: formValues.description,
                    status: formValues.status ? 1 : 0
                }
                await postCourseMutation.mutateAsync(requestBody)
            }

            notificationApi.success({
                message: 'Thao tác thành công'
            })

            return navigate('/config/course')
        } catch (error) {
            return notificationApi.error({
                message: 'Thao tác thất bại'
            })
        }
    }

    //   Effects
    useEffect(() => {
        if (!getCourseByIdQuery.data) {
            return
        }

        form.setFieldsValue({
            name: getCourseByIdQuery.data.name,
            price: getCourseByIdQuery.data.price,
            numberOfSessions: getCourseByIdQuery.data.numberOfSessions,
            description: getCourseByIdQuery.data.description,
            status: getCourseByIdQuery.data.status
        })

    }, [form, getCourseByIdQuery.data])

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

                <Form.Item<PostCourseRequestBodyType>
                    name='name'
                    label='Tên khóa học'
                    rules={[
                        { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên khóa học' }
                    ]}
                >
                    <Input placeholder='Tên khóa học' />
                </Form.Item>

                <Form.Item<PostCourseRequestBodyType> 
                    name='price' 
                    label='Giá'
                    rules={[
                        { 
                            required: true, 
                            type: 'number',
                            message: 'Vui lòng nhập giá' 
                        }
                    ]}
                >
                    <InputNumber className='w-full' placeholder='Giá' />
                </Form.Item>

                <Form.Item<PostCourseRequestBodyType>
                    name='numberOfSessions'
                    label='Số buổi học'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số buổi học (số nguyên)',
                            type: 'number' 
                        }
                    ]}
                >
                    <InputNumber className='w-full' placeholder='Số buổi học' />
                </Form.Item>

                <Form.Item<PostCourseRequestBodyType>
                    name='description'
                    label='Mô tả'
                    rules={[
                        {
                            required: false,
                            message: 'Vui lòng nhập mô tả'
                        }
                    ]}
                    className='col-span-3'
                >
                    <Input.TextArea placeholder='Mô tả' />
                </Form.Item>
            
                <Form.Item<PostCourseRequestBodyType> name='status' valuePropName='checked'>
                    <Checkbox
                     defaultChecked={true}>Kích hoạt</Checkbox>
                </Form.Item>
            </Form>

            <Button
                type='primary'
                className='self-start'
                loading={postCourseMutation.isPending || patchCourseMutation.isPending}
                onClick={() => form.submit()}
            >
                Hoàn thành
            </Button>
        </div>
    )
}

export default CourseCreationPage
