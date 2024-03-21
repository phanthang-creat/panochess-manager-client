/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, DatePicker, Form, Input, InputNumber, Select, Tag, TreeSelect, Upload, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { generateSlug, handleBeforeUpload, handleChangeUploadImage } from '~/utils'
// import { BASE_URLS } from '~/configs'
import { usePostUploadFilesMutation } from '~/stores/server/fileUploadStore'
import { useGetStudentTitlesQuery } from '~/stores/server/student/studentTitleStore'
import { useGetStudentStatusesQuery } from '~/stores/server/student/studentStatusStore'
import { useGetCoursesQuery } from '~/stores/server/course/courseStore'
import { usePostStudentMutation } from '~/stores/server/student/studentStore'
import { PostStudentRequestBodyType } from '~/types/students/studentType'
import { useGetGenderQuery } from '~/stores/server/gender/genderStore'
import { useGetBranchQuery } from '~/stores/server/branch/branchStore'
import { PostStudentParentRequestBodyType, StudentParentType } from '~/types/students/studentParentType'
import { useGetTimeSlotsQuery } from '~/stores/server/timeSlot/timeSlotStore'
import { daysOfWeek } from '~/utils/daysOfWeek'

type FormType = PostStudentRequestBodyType

type ParentFormType = PostStudentParentRequestBodyType

const FORM_INITIAL_PARENT_VALUES: PostStudentParentRequestBodyType = {
    motherName: '',
    motherPhone: '',
    motherEmail: '',
    fatherName: '',
    fatherPhone: '',
    fatherEmail: '',
    address: '',
    description: '',
    // branchId: 1
}

const FORM_INITIAL_VALUES: PostStudentRequestBodyType = {
    name: '',
    titleId: 1,
    statusId: 1,
    courseId: null,
    description: '',
    avatar: '',
    dob: '',
    email: '',
    elo: 0,
    phone: '',
    genderId: 1,
    parentId: '',
    branchId: 2,
    parent: FORM_INITIAL_PARENT_VALUES,
    timeSlots: []
}

const StudentCreationPage = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm<FormType>()
    const [parentForm] = Form.useForm<ParentFormType>()
    const [notificationApi, notificationContextHolder] = notification.useNotification()

    // Stores
    const getStudentTitlesQuery = useGetStudentTitlesQuery()
    const getStudentStatusesQuery = useGetStudentStatusesQuery()
    const getCoursesQuery = useGetCoursesQuery()
    const getGenderQuery = useGetGenderQuery()
    const getBranchesQuery = useGetBranchQuery()
    // const postStudentParentMutation = usePostStudentParentMutation()
    const postUploadFilesMutation = usePostUploadFilesMutation()
    const postStudentMutation = usePostStudentMutation()
    const getTimeSlotsQuery = useGetTimeSlotsQuery()

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

    // before unload or out of page

    const handleSubmit = async () => {
        try {

            const studentParentFormValues = parentForm.getFieldsValue()

            const formValues = form.getFieldsValue()

            const studentParentRequestBody: StudentParentType = {
                motherName: studentParentFormValues.motherName,
                motherPhone: studentParentFormValues.motherPhone,
                motherEmail: studentParentFormValues.motherEmail,
                fatherName: studentParentFormValues.fatherName,
                fatherPhone: studentParentFormValues.fatherPhone,
                fatherEmail: studentParentFormValues.fatherEmail,
                address: studentParentFormValues.address,
                description: studentParentFormValues.description,
            }

            const dataImageUrl = imageUrl ? await handleUploadFile(imageUrl as unknown as File) : null

            const requestBody: FormType = {
                name: formValues.name,
                avatar: dataImageUrl,
                email: formValues.email,
                phone: formValues.phone,
                dob: formValues.dob,
                elo: formValues.elo,
                genderId: formValues.genderId,
                titleId: formValues.titleId,
                statusId: formValues.statusId,
                branchId: formValues.branchId,
                courseId: formValues.courseId,
                description: formValues.description,
                parent: studentParentRequestBody,
                timeSlots: formValues.timeSlots?.map((item: any) => JSON.parse(item) as any)
            }

            await postStudentMutation.mutateAsync(requestBody)

            notificationApi.success({
                message: 'Thao tác thành công'
            })

            return navigate('/student')
        } catch (error) {
            return notificationApi.error({
                message: 'Thao tác thất bại'
            })
        }
    }

    // const handleChangeFileUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

    //   Effects
    useEffect(() => {

    }, [form])


    return (
        <div className='flex flex-col items-start'>
            {notificationContextHolder}

            <h1 className='text-xl font-medium mb-4'>Chỉnh sửa thông tin học viên</h1>

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
                        name='branchId'
                        label='Chi nhánh'
                        rules={[{ required: true, type: 'number', message: 'Vui lòng chọn chi nhánh' }]}
                        className='col-span-1'
                    >
                        <Select
                            showSearch
                            placeholder='Chi nhánh'
                            options={getBranchesQuery.data?.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))}
                        />
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

                    <Form.Item<FormType> name='dob' label='Ngày sinh'>
                        <DatePicker
                            format='DD/MM/YYYY'
                            placeholder='Ngày sinh'
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item<FormType> name='elo' label='Elo'>
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item<FormType> name='titleId' label='Chức danh'>
                        <Select
                            showSearch
                            placeholder='Chức danh'
                            options={getStudentTitlesQuery.data?.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item<FormType> name='statusId' label='Trạng thái'>
                        <Select
                            showSearch
                            placeholder='Trạng thái'
                            options={getStudentStatusesQuery.data?.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item<FormType> name='courseId' label='Khóa học'>
                        <Select
                            showSearch
                            placeholder='Khóa học'
                            options={getCoursesQuery.data?.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item<FormType> name='timeSlots' label='Ca học'>
                        <TreeSelect
                            treeData={daysOfWeek.map((item) => ({
                                title: item.label,
                                value: `day-${item.value}`,
                                key: `day-${item.value}`,
                                checkable: false,
                                children: getTimeSlotsQuery.data?.map((timeSlot) => ({
                                    title: `${timeSlot.start} - ${timeSlot.end}`,
                                    value: JSON.stringify({
                                        dayOfWeek: item.value,
                                        timeSlotId: timeSlot.id
                                    }),
                                    key: JSON.stringify({
                                        dayOfWeek: item.value,
                                        timeSlotId: timeSlot.id
                                    }),
                                    // disabled: !timeSlot.isEnable
                                }))
                            }))}
                            treeCheckable
                            tagRender={({ value, closable, onClose }) => {
                                const object = JSON.parse(value as string)
                                return (
                                    <Tag
                                        closable={closable}
                                        onClose={onClose}
                                        style={{ marginRight: 3 }}
                                    >
                                        {
                                            `${daysOfWeek[object.dayOfWeek].label} - ${getTimeSlotsQuery.data?.find((item) => item.id === object.timeSlotId)?.start} - ${getTimeSlotsQuery.data?.find((item) => item.id === object.timeSlotId)?.end}`
                                        }
                                    </Tag>
                                )
                            }}
                            
                            showCheckedStrategy={TreeSelect.SHOW_PARENT}
                            placeholder='Ca học'
                            style={{ width: '100%' }}
                        />
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

            <Form
                form={parentForm}
                initialValues={FORM_INITIAL_PARENT_VALUES}
                layout='vertical'
                className='grid grid-flow-row gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mt-8'
            >
                <div
                    className='sm:col-span-2 md:col-span-2 lg:col-span-3 grid grid-flow-row gap-4 grid-cols-2 bg-white p-4 rounded-md shadow-md'
                >
                    <h1 className='col-span-2 text-lg font-medium mb-4'>
                        Thông tin phụ huynh
                    </h1>

                    <Form.Item<ParentFormType>
                        name='motherName'
                        label='Tên mẹ'
                        rules={[{ type: 'string', message: 'Vui lòng nhập tên' }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Tên mẹ' />
                    </Form.Item>

                    <Form.Item<ParentFormType>
                        name='motherPhone'
                        label='Số điện thoại mẹ'
                        rules={[{ type: 'string', message: 'Vui lòng nhập số điện thoại' }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Số điện thoại mẹ' />
                    </Form.Item>

                    <Form.Item<ParentFormType>
                        name='motherEmail'
                        label='Email mẹ'
                        rules={[{ type: 'email', message: 'Vui lòng nhập email' }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Email mẹ' />
                    </Form.Item>

                    <Form.Item<ParentFormType>
                        name='fatherName'
                        label='Tên bố'
                        rules={[{ type: 'string', message: 'Vui lòng nhập tên' }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Tên bố' />
                    </Form.Item>

                    <Form.Item<ParentFormType>
                        name='fatherPhone'
                        label='Số điện thoại bố'
                        rules={[{
                            type:
                                'string', message: 'Vui lòng nhập số điện thoại'
                        }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Số điện thoại bố' />
                    </Form.Item>

                    <Form.Item<ParentFormType>
                        name='fatherEmail'
                        label='Email bố'
                        rules={[{ type: 'email', message: 'Vui lòng nhập email' }]}
                        className='col-span-1'
                    >
                        <Input placeholder='Email bố' />
                    </Form.Item>

                    <Form.Item<ParentFormType>
                        name='address'
                        label='Địa chỉ'
                        rules={[{ type: 'string', message: 'Vui lòng nhập địa chỉ' }]}
                        className='col-span-2'
                    >
                        <Input placeholder='Địa chỉ' />
                    </Form.Item>
                </div>
            </Form>

            {/* Button submit, cancel */}
            <div className='mt-8'>
                <Button type='primary' onClick={() => form.submit()} className='mr-4'>
                    Lưu
                </Button>
                <Button type='default' onClick={() => navigate('/student')}>
                    Hủy
                </Button>
            </div>

        </div>
    )
}

export default StudentCreationPage
