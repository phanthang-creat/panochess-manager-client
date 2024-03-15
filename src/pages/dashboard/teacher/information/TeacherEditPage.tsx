/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Input, InputNumber, Select, Upload, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { generateSlug, handleBeforeUpload, handleChangeUploadImage } from '~/utils'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { useGetGenderQuery } from '~/stores/server/gender/genderStore'
import { useGetBranchQuery } from '~/stores/server/branch/branchStore'
import { PatchTeacherRequestBodyType } from '~/types/teachers/teacherType'
import { useGetTeacherStatusesQuery } from '~/stores/server/teacher/teacherStatusStore'
import { useGetTeacherByIdQuery, usePatchTeacherMutation } from '~/stores/server/teacher/teacherStore'
// import { usePostStudentParentMutation } from '~/stores/server/student/studentParentStore'

type FormType = PatchTeacherRequestBodyType

const FORM_INITIAL_VALUES: PatchTeacherRequestBodyType = {
    name: '',
    avatar: '',
    email: '',
    phone: '',
    differentPhone: null,
    dob: '',
    address: '',
    elo: 0,
    description: '',
    statusId: 1,
    basicSalary: 0,
    branchIds: [],
    genderId: 1
}

const TeacherEditPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [form] = Form.useForm<FormType>()
    const [notificationApi, notificationContextHolder] = notification.useNotification()

    // Stores
    const getTeacherStatusQuery = useGetTeacherStatusesQuery()
    const getGenderQuery = useGetGenderQuery()
    const getBranchesQuery = useGetBranchQuery()
    const getTeacherByIdQuery = useGetTeacherByIdQuery(id ?? '')
    const postUploadFilesMutation = usePostUploadFilesMutation()
    const patchTeacherMutation = usePatchTeacherMutation()

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
                avatar: dataImageUrl,
                email: formValues.email,
                phone: formValues.phone === '' ? undefined : formValues.phone,
                differentPhone: formValues.differentPhone === '' ? undefined : formValues.differentPhone,
                dob: formValues.dob,
                elo: formValues.elo,
                genderId: formValues.genderId,
                address: formValues.address,
                description: formValues.description === '' ? undefined : formValues.description,
                statusId: formValues.statusId,
                basicSalary: formValues.basicSalary,
                branchIds: formValues.branchIds
            }

            await patchTeacherMutation.mutateAsync({ 
                id : id ?? '',
                data: requestBody
            })

            notificationApi.success({
                message: 'Thao tác thành công'
            })

            return navigate('/teacher')
        } catch (error) {
            return notificationApi.error({
                message: 'Thao tác thất bại'
            })
        }
    }

    // const handleChangeFileUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

    //   Effects
    useEffect(() => {
        if (!id) {
            notificationApi.error({
                message: 'Không tìm thấy giáo viên'
            })

            return navigate('/students')
        }

        form.setFieldsValue({
            name: getTeacherByIdQuery.data?.name,
            email: getTeacherByIdQuery.data?.email,
            phone: getTeacherByIdQuery.data?.phone,
            differentPhone: getTeacherByIdQuery.data?.differentPhone,
            dob: getTeacherByIdQuery.data?.dob,
            elo: getTeacherByIdQuery.data?.elo,
            genderId: getTeacherByIdQuery.data?.genderId,
            address: getTeacherByIdQuery.data?.address,
            description: getTeacherByIdQuery.data?.description,
            statusId: getTeacherByIdQuery.data?.statusId,
            basicSalary: getTeacherByIdQuery.data?.basicSalary,
            branchIds: getTeacherByIdQuery.data?.teacherBranches?.map((item) => item.branchId)
        })

        // setImageUrl(BASE_URLS.uploadEndPoint + getStudentByIdQuery.data.avatar)
    }, [form, getTeacherByIdQuery.data, id, navigate, notificationApi])

    return (
        <div className='flex flex-col items-start'>
            {notificationContextHolder}

            <h1 className='text-xl font-medium mb-4'>Thêm mới giáo viên</h1>

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
                        Thông tin cơ bản
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
                        label='Họ và tên'
                        rules={[{ required: true, type: 'string', transform: (value) => value.trim(), message: 'Vui lòng nhập tên' }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Họ và tên' onChange={(e) => form.setFieldValue('slug', generateSlug(e.target.value))} />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='genderId'
                        label='Giới tính'
                        rules={[{ required: true, type: 'number', message: 'Vui lòng chọn giới tính' }]}
                        className='col-span-1'
                    >
                        <Select
                            showSearch
                            placeholder='Giới tính'
                            options={getGenderQuery.data?.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='email'
                        label='Email'
                        rules={[{ type: 'email', message: 'Vui lòng nhập email' }]}
                    >
                        <Input placeholder='Email' />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='phone'
                        label='Số điện thoại'
                        rules={[{ required: true, type: 'string', message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input placeholder='Số điện thoại' />
                    </Form.Item>

                    <Form.Item<FormType>
                        name='differentPhone'
                        label='Số điện thoại khác'
                        rules={[{ required: false, type: 'string', message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input placeholder='Số điện thoại khác' />
                    </Form.Item>

                    <Form.Item<FormType> name='dob' label='Ngày sinh'>
                        <Input type='date' />
                    </Form.Item>

                    <Form.Item<FormType> name='elo' label='Elo'>
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item<FormType> name='basicSalary' label='Lương cơ bản'>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item<FormType> name='address' label='Địa chỉ'>
                        <Input placeholder='Địa chỉ' />
                    </Form.Item>

                    <Form.Item<FormType> name='branchIds' label='Chi nhánh'>
                        <Select
                            mode='multiple'
                            showSearch
                            placeholder='Chi nhánh'
                            options={getBranchesQuery.data?.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item<FormType> name='statusId' label='Trạng thái'>
                        <Select
                            showSearch
                            placeholder='Trạng thái'
                            options={getTeacherStatusQuery.data?.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))}
                        />
                    </Form.Item>

                    <Button
                        type='primary'
                        className='col-span-2'
                        loading={patchTeacherMutation.isPending}
                        onClick={() => form.submit()}
                    >
                        Lưu
                    </Button>
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

            {/* Teaching history */}
            <div className='grid grid-flow-row gap-4 grid-cols-1 bg-white p-4 rounded-md shadow-md'>
                <h1 className='text-lg font-medium mb-4'>Lịch sử giảng dạy</h1>
            </div>

        </div>
    )
}

export default TeacherEditPage
