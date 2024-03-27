import { EditOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Table } from "antd"
import useNotification from "antd/es/notification/useNotification"
import { useState } from "react"
import slugify from "slugify"
import { useGetBranchQuery, usePatchBranchMutation, usePostBranchMutation } from "~/stores/server/branch/branchStore"
import { GetBranchQueryItemResponseDataType, PatchBranchRequestBodyType, PostBranchRequestBodyType } from "~/types/branchType"

type FormType = PostBranchRequestBodyType

export const BranchPage = () => {

    const [notification, notificationContextHolder] = useNotification()
    const [form] = Form.useForm<FormType>()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<GetBranchQueryItemResponseDataType | null>(null)

    const getBranchesQuery = useGetBranchQuery()
    const postMutation = usePostBranchMutation()
    const patchMution = usePatchBranchMutation()

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên chi nhánh',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        // {
        //     title: 'Số điện thoại',
        //     dataIndex: 'phone',
        //     key: 'phone',
        // },
        // {
        //     title: 'Email',
        //     dataIndex: 'email',
        //     key: 'email',
        // },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: GetBranchQueryItemResponseDataType) => (
                <div className='flex items-center justify-center gap-2'>
                    <Button
                        shape='circle'
                        icon={<EditOutlined />}
                        onClick={() => {
                            setIsModalVisible(true)
                            setSelectedBranch(record)
                            form.setFieldsValue({
                                name: record.name,
                                address: record.address
                            })

                        }}
                    />
                    {/* <Button
                        shape='circle'
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setIsOpenConfirmDeleteModal(true)
                            setSelectedItemId(record.id)
                        }}
                    /> */}
                </div>
            ),
        },
    ]

    const handleSubmit = async () => {
        const values = form.getFieldsValue()

        const requestBody: PostBranchRequestBodyType = {
            name: values.name,
            slug: slugify(values.name),
            address: values.address,
            status: 1
        }

        try {
            await postMutation.mutateAsync(requestBody)
            notification.success({
                message: 'Thêm chi nhánh thành công'
            })
            setIsModalVisible(false)

        } catch (error) {
            notification.error({
                message: 'Thêm chi nhánh thất bại'
            })
        }
    }
    

    const handleUpdate = async () => {
        if (!selectedBranch) {
            return
        }

        const values = form.getFieldsValue()

        const requestBody: PatchBranchRequestBodyType = {
            name: values.name === selectedBranch.name ? undefined : values.name,
            slug: slugify(values.name) === selectedBranch.slug ? undefined : slugify(values.name),
            address: values.address === selectedBranch.address ? undefined : values.address,
            status: 1
        }

        try {
            await patchMution.mutateAsync({
                id: selectedBranch.id.toString(),
                requestBody
            })
            notification.success({
                message: 'Cập nhật chi nhánh thành công'
            })
            setIsModalVisible(false)

        } catch (error) {
            notification.error({
                message: 'Cập nhật chi nhánh thất bại'
            })
        }
    }

    return (
        <div>   
            {notificationContextHolder}
            <Table
                columns={columns}
                dataSource={getBranchesQuery.data}
                loading={getBranchesQuery.isLoading}
                rowKey="id"
            />
            <Modal
                title="Thêm chi nhánh"
                onOk={() => {
                    form.submit()
                }}
                onCancel={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                }}
                open={isModalVisible}
                footer={null}
                closable={true}
    
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={selectedBranch ? handleUpdate : handleSubmit}
                    className='grid grid-cols-1 grid-flow-row gap-x-4'

                >
                    <Form.Item<FormType>
                        label="Tên chi nhánh"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh' }]}
                    >
                        <Input placeholder="Nhập tên chi nhánh" />
                    </Form.Item>
                    <Form.Item<FormType>
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {selectedBranch ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}