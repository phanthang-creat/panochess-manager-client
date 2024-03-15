/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Form, Input, notification } from 'antd'
import { PatchProductCategoryRequestBodyType, PostProductCategoryRequestBodyType } from '~/types/product-categories/productCategoryType'
import { useGetProductCategoryByIdQuery, usePatchProductCategoryMutation, usePostProductCategoryMutation } from '~/stores/server/product-category/productCategoryStore'
import { generateSlug } from '~/utils'

const FORM_INITIAL_VALUES: PostProductCategoryRequestBodyType = {
    name: '',
    slug: '',
    description: '',
}

const ProductCategoryCreationPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [form] = Form.useForm<PostProductCategoryRequestBodyType>()
    const [notificationApi, notificationContextHolder] = notification.useNotification()

    // Stores
    const getByIdQuery = useGetProductCategoryByIdQuery({
        id: id ?? ''
    })
    const postMutation = usePostProductCategoryMutation()
    const patchMutation = usePatchProductCategoryMutation()


    const handleSubmit = async () => {
        try {
            form.validateFields()
            const formValues = form.getFieldsValue()

            if (id) {
                const requestBody: PatchProductCategoryRequestBodyType = {
                    name: formValues.name,
                    slug: formValues.slug,
                    description: formValues.description
                }
                await patchMutation.mutateAsync({
                    id,
                    requestBody
                })
            }
            else {
                const requestBody: PostProductCategoryRequestBodyType = {
                    name: formValues.name,
                    slug: formValues.slug,
                    description: formValues.description
                }
                const response = await postMutation.mutateAsync(requestBody)
                const newItem = response.data

                notificationApi.success({
                    message: 'Thao tác thành công'
                })

                console.log(newItem)

                return navigate('/config/product-categories/update/' + newItem.id)
            }

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
            slug: getByIdQuery.data.slug,
            description: getByIdQuery.data.description
        })

    }, [form, getByIdQuery.data])

    return (
        <div className='flex flex-col items-start'>
            {notificationContextHolder}

            <div
                className='bg-white p-4 rounded-md shadow-md w-full'
            >

                <h1 className='text-xl font-medium mb-4'>{id ? 'Thông tin danh mục sản phẩm' : 'Thêm mới danh mục sản phẩm'}</h1>

                <Form
                    form={form}
                    initialValues={FORM_INITIAL_VALUES}
                    layout='vertical'
                    onFinish={handleSubmit}
                    className='grid lg:grid-cols-3 md:grid-cols-2 grid-flow-row gap-x-4'
                >

                    <Form.Item<PostProductCategoryRequestBodyType>
                        name='name'
                        label='Tên danh mục sản phẩm'
                        rules={[
                            { required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên danh mục sản phẩm' }
                        ]}
                    >
                        <Input placeholder='Tên danh mục sản phẩm' onChange={(e) => form.setFieldValue('slug', generateSlug(e.target.value))} />
                    </Form.Item>

                    <Form.Item<PostProductCategoryRequestBodyType>
                        name='slug'
                        label='Slug'
                    >
                        <Input placeholder='Slug' disabled />
                    </Form.Item>

                    <Form.Item<PostProductCategoryRequestBodyType>
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
                </Form>

                <Button
                    type='primary'
                    className='self-start'
                    loading={postMutation.isPending}
                    onClick={() => form.submit()}
                >
                    Hoàn thành
                </Button>
            </div>
        </div>
    )
}

export default ProductCategoryCreationPage
