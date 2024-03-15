/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, InputNumber, Select, Upload, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { generateSlug, handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { useGetBranchQuery } from '~/stores/server/branch/branchStore'
import { PostProductRequestBodyType } from '~/types/product/productType'
import { usePostProductMutation } from '~/stores/server/product/productStore'
import { useGetProductCategoriesQuery } from '~/stores/server/product-category/productCategoryStore'
// import { usePostStudentParentMutation } from '~/stores/server/student/studentParentStore'

type FormType = PostProductRequestBodyType

const FORM_INITIAL_VALUES: FormType = {
    name: '',
    slug: '',
    avatar: '',
    price: 0,
    description: '',
    categoryId: 0,
    productQuantity: [],
    status: 1
}

export const ProductCreationPage = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm<FormType>()
    const [notificationApi, notificationContextHolder] = notification.useNotification()

    // Stores
    const getBranchesQuery = useGetBranchQuery()
    const getProductCategoryQuery = useGetProductCategoriesQuery()
    const postUploadFilesMutation = usePostUploadFilesMutation()
    const postMutation = usePostProductMutation()

    // States
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    //   Methods
    const handleUploadFile = async (file: File) => {
        try {
            const formData = new FormData()
            formData.append('files', file)
            const uploadFileResponse = await postUploadFilesMutation.mutateAsync(formData)
            return uploadFileResponse.data[0].path
        } catch (error) {
            notificationApi.error({
                message: 'Thao tác thất bại'
            })
            return null
        }
    }

    const handleSubmit = async () => {
        try {

            const formValues = form.getFieldsValue()

            const dataImageUrl = imageUrl ? await handleUploadFile(imageUrl as unknown as File) : null

            const requestBody: FormType = {
                name: formValues.name,
                slug: formValues.slug,
                avatar: dataImageUrl,
                price: formValues.price,
                description: formValues.description,
                categoryId: formValues
                    .categoryId,
                productQuantity: formValues.productQuantity,
                status: formValues.status 
            }

            await postMutation.mutateAsync(requestBody)

            notificationApi.success({
                message: 'Thao tác thành công'
            })

            return navigate('/product')
        } catch (error) {
            return notificationApi.error({
                message: 'Thao tác thất bại'
            })
        }
    }

    // const handleChangeFileUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

    //   Effects
    useEffect(() => {

        form.setFieldsValue(FORM_INITIAL_VALUES)

        if (postMutation.isSuccess) {
            form.resetFields()
        }
    }, [form, postMutation.isSuccess])

    return (
        <div className='flex flex-col items-start'>
            {notificationContextHolder}

            <h1 className='text-xl font-medium mb-4'>Thêm mới sản phẩm</h1>

            <Form
                form={form}
                initialValues={FORM_INITIAL_VALUES}
                layout='vertical'
                onFinish={handleSubmit}
                className='grid grid-flow-row gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'
            >
                {/* Basic information */}
                <div
                    className='sm:col-span-2 md:col-span-2 lg:col-span-3 grid grid-flow-row gap-4 grid-cols-2 bg-white p-4 rounded-md shadow-md'
                >
                    <h1 className='col-span-2 text-lg font-medium mb-4'>
                        Thông tin sản phẩm
                    </h1>
                    <Form.Item<FormType>
                        label='Ảnh đại diện'
                        name='avatar'
                        valuePropName='file'
                        getValueFromEvent={(e: any) => {
                            return e?.file
                        }}
                        rules={[{ message: 'Vui lòng chọn ảnh' }]}
                        className='col-span-1'
                    >
                        <Upload
                            listType='picture-card'
                            showUploadList={false}
                            beforeUpload={handleBeforeUpload}
                            onChange={(info) =>
                                handleChangeUploadImage(info, notificationApi, () => {
                                    setImageUrl(window.URL.createObjectURL(info.file as unknown as File))
                                })
                            }
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt='avatar' className='w-[100px] h-[100px] object-cover' />
                            ) : (
                                <div>
                                    <PlusOutlined />
                                    <div className='mt-2'>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item<FormType>
                        name='name'
                        label='Tên sản phẩm'
                        rules={[{ required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên' }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Tên sản phẩm' onChange={(e) => form.setFieldValue('slug', generateSlug(e.target.value))} />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='slug'
                        label='Slug'
                        rules={[{ required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập slug' }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Slug' disabled />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='price'
                        label='Giá'
                        rules={[{ required: true, type: 'number', message: 'Vui lòng nhập giá' }]}
                        className='col-span-1'
                    >
                        <InputNumber
                            placeholder='Giá'
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => (value as string).replace(/\$\s?|(,*)/g, '')}

                        />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='categoryId'
                        label='Danh mục'
                        rules={[{ required: true, type: 'number', message: 'Vui lòng chọn danh mục' }]}
                        className='col-span-1'
                    >
                        <Select
                            placeholder='Chọn danh mục'
                            options={getProductCategoryQuery.data?.map((item) => ({ label: item.name, value: item.id }))}
                        />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='productQuantity'
                        label='Số lượng'
                        // rules={[{ required: true, type: 'number', message: 'Vui lòng nhập số lượng' }]}
                        
                        className='col-span-1'
                    >
                        <Form.List name='productQuantity'>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <div key={field.key} className='flex gap-4'>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'quantity']}
                                                fieldKey={[field.fieldKey || '', 'quantity']}
                                                rules={[{ required: true, type: 'number', message: 'Vui lòng nhập số lượng' }]}
                                            >
                                                <InputNumber placeholder='Số lượng' style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'branchId']}
                                                fieldKey={[field.fieldKey ?? '', 'branchId']}
                                                rules={[{ required: true, type: 'number', message: 'Vui lòng chọn chi nhánh' }]}
                                            >
                                                <Select
                                                    placeholder='Chọn chi nhánh'
                                                    options={getBranchesQuery.data?.map((item) => ({ label: item.name, value: item.id }))}
                                                />
                                            </Form.Item>
                                            <Button
                                                type='primary'
                                                danger
                                                onClick={() => remove(field.name)}
                                                className='self-start'
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type='dashed' onClick={() => add()} block>
                                        Thêm
                                    </Button>
                                </>
                            )}
                        </Form.List>

                    </Form.Item>

                    <Form.Item
                        className='col-span-1'
                        name='status'

                    >
                        <Select
                            placeholder='Trạng thái'
                            options={[
                                { label: 'Kích hoạt', value: 1 },
                                { label: 'Khóa', value: 0 }
                            ]}
                        />
                    </Form.Item>


                    <Form.Item
                        className='col-span-2'
                    >
                        <Button
                            type='primary'
                            className='self-end'
                            loading={postMutation.isPending}
                            onClick={() => form.submit()}
                        >
                            Hoàn thành
                        </Button>
                    </Form.Item>


                </div>
                <div
                    className='grid grid-flow-row gap-4 grid-cols-1'
                >
                    <Form.Item<FormType> name='description' label='Ghi chú' className='col-span-1 bg-white p-4 rounded-md shadow-md max-h-[300px] overflow-y-auto'>
                        <Input.TextArea
                            placeholder='Ghi chú'
                            autoSize={{ minRows: 10, maxRows: 10 }}
                        />
                    </Form.Item>
                </div>
            </Form>
        </div>
    )
}
