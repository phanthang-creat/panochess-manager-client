/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, notification, List, Skeleton, Divider, Table, Select, InputNumber } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { useGetBranchQuery } from '~/stores/server/branch/branchStore'
import { PostOrderRequestBodyType } from '~/types/order/orderType'
import { useGetOrderStatusesQuery } from '~/stores/server/order/orderStatusStore'
import { usePostOrderMutation } from '~/stores/server/order/orderStore'
import { useGetProductQuery } from '~/stores/server/product/productStore'
import { GetProductQuery, GetProductQueryItemResponseDataType } from '~/types/product/productType'
import Search from 'antd/es/input/Search'
import debounce from 'lodash.debounce'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProductImage from '~/components/productImage/ProductImage'


type FormType = PostOrderRequestBodyType

const FORM_INITIAL_VALUES: FormType = {
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    orderDetails: [],
    statusId: 1,
    branchId: 1,
}

export const OrderCreationPage = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm<FormType>()
    const [notificationApi, notificationContextHolder] = notification.useNotification() 
    const [cart, setCart] = useState<{
        product: GetProductQueryItemResponseDataType,
        quantity: number,
    }[]>([])
 
    // Stores
    const getBranchesQuery = useGetBranchQuery()
    const getOrderStatusesQuery = useGetOrderStatusesQuery()
    const [query, setQuery] = useState<GetProductQuery>({
        page: 1,
        take: 10
    })
    const [isOpenListProduct, setIsOpenListProduct] = useState(false)
    const getProductQuery = useGetProductQuery(query)
    const postMutation = usePostOrderMutation()

    // States
    // const [imageUrl, setImageUrl] = useState<string | null>(null)

    //   Methods
    const handleSubmit = async () => {
        try {

            const formValues = form.getFieldsValue()

            const orderDetails = cart.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity
            }))

            const requestBody: FormType = {
                name: formValues.name,
                phone: formValues.phone,
                email: formValues.email,
                address: formValues.address,
                description: formValues.description,
                statusId: formValues.statusId,
                branchId: formValues.branchId,
                orderDetails: orderDetails
            }

            // console.log(requestBody)

            await postMutation.mutateAsync(requestBody)

            return navigate('/order/result')
        } catch (error) {
            return notificationApi.error({
                message: 'Thao tác thất bại'
            })
        }
    }

    //  Memos
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceFn = useCallback(debounce(handleDebounceFn, 1000), []);

    function handleDebounceFn() {
        
        getProductQuery.refetch()
    }
    
    
    function handleChange (event: { target: { value: any } }) {
        setQuery({
            ...query,
            name: event.target.value
        })
        debounceFn();
    }

    //   Effects
    useEffect(() => {

        FORM_INITIAL_VALUES.branchId = getBranchesQuery.data?.[0]?.id ?? 1
        FORM_INITIAL_VALUES.statusId = getOrderStatusesQuery.data?.[0]?.id ?? 1

        form.setFieldsValue(FORM_INITIAL_VALUES)

        if (postMutation.isSuccess) {
            form.resetFields()
        }
    }, [form, getBranchesQuery.data, getOrderStatusesQuery.data, postMutation.isSuccess])

    return (
        <div className='flex flex-col items-start'>
            {notificationContextHolder}

            <h1 className='text-xl font-medium mb-4'>Thông tin đơn hàng</h1>

            <Form
                form={form}
                initialValues={FORM_INITIAL_VALUES}
                layout='vertical'
                onFinish={handleSubmit}
                className='grid grid-flow-row gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'
            >
                {/* Search bar to add list product of order */}
                <div
                    className='sm:col-span-2 md:col-span-2 lg:col-span-3 grid grid-flow-row gap-2 grid-cols-2 bg-white p-4 rounded-md shadow-md'
                >
                    {/* <h1 className='font-medium col-span-2'>Danh sách sản phẩm</h1> */}

                    <div className='relative col-span-2 height-100'>
                        <Search placeholder="Tìm kiếm sản phẩm" enterButton="Tìm kiếm" size="large" 
                            // use debounce to delay search when user input
                            onChange={handleChange}
                            onFocus={() => setIsOpenListProduct(true)}       

                        >
                        </Search>

                        {/* List result product at under search */}
                        {
                            isOpenListProduct && (
                                <div className='absolute left-0 w-full h-full bg-transparent bg-opacity-50 z-50'>
                                    <div className='bg-white p-4 rounded-md shadow-md'>
                                        {/* close button */}
                                        <div className='flex justify-end'>
                                            <Button
                                                type='text'
                                                icon={<CloseCircleFilled />}
                                                onClick={() => setIsOpenListProduct(false)}
                                            >
                                            </Button>
                                        </div>
                                        {
                                            getProductQuery.data ? 
                                            <InfiniteScroll
                                                dataLength={getProductQuery.data.meta.itemCount}
                                                next={() => setQuery({ ...query, page: query.page + 1 })}
                                                hasMore={getProductQuery.data.meta.hasNextPage}
                                                loader={<Skeleton paragraph={{ rows: 1 }} active />}
                                                height={500}
                                                endMessage={<Divider plain>
                                                    <p className='text-center'>Không còn sản phẩm nào</p>
                                                </Divider>}
                                            >
                                                <List>
                                                    {getProductQuery.data?.data.map((product) => (
                                                        <List.Item
                                                            key={product.id}
                                                        >
                                                            <List.Item.Meta
                                                                title={
                                                                    // name, input quantity and add button
                                                                    <div className='flex justify-between items-center pr-4'>
                                                                        <p>{product.name}</p>

                                                                        {/* Tag: Sold out, or in cart */}
                                                                        {product.productQuantity.every((item) => item.quantity === 0) && <p className='text-red-500'>Hết hàng</p>}
                                                                        {cart.some((item) => item.product.id === product.id) && <p className='text-green-500'>Đã thêm</p>}

                                                                        {/* add button */}
                                                                        <Button
                                                                            type='primary'
                                                                            onClick={() => {
                                                                                const newCart = cart.concat({
                                                                                    product,
                                                                                    quantity: 1
                                                                                })
                                                                                setCart(newCart)
                                                                            }}
                                                                            disabled={
                                                                                // disable button if product quantity is 0 or product is already in cart
                                                                                product.productQuantity.every((item) => item.quantity === 0) || cart.some((item) => item.product.id === product.id)
                                                                            }
                                                                        >
                                                                            Thêm
                                                                        </Button>
                                                                    </div>
                                                                }
                                                                description={
                                                                    <div>
                                                                        <p>Giá: {product.price.toLocaleString()} đ</p>
                                                                        <List
                                                                            header={<div>Tồn kho</div>}
                                                                            dataSource={product.productQuantity}
                                                                            renderItem={(productQuantity) => (
                                                                                <List.Item>
                                                                                    <List.Item.Meta
                                                                                        title={productQuantity.branch.name}
                                                                                        description={`Số lượng: ${productQuantity.quantity}`}
                                                                                    />
                                                                                    
                                                                                </List.Item>
                                                                            )}

                                                                        >
                                                                        </List>
                                                                    </div>
                                                                }
                                                                
                                                                avatar={<ProductImage src={product.avatar} width={50} />}
                                                                    />
                                                        </List.Item>
                                                    ))}
                                                </List>
                                            </InfiniteScroll>
                                            : 
                                            <InfiniteScroll
                                                    hasMore={false}
                                                    height={500}
                                                    endMessage={<Divider plain>
                                                        <p className='text-center'>Không tìm thấy sản phẩm nào</p>
                                                    </Divider>} next={function () {
                                                        throw new Error('Function not implemented.')
                                                    } } children={undefined} loader={undefined} dataLength={0}                                            >
                                            </InfiniteScroll>
                                        }
                                    </div>
                                </div>
                            )
                        }

                        {/* List product in cart */}
                        <Table
                            className='mt-4'
                            title={() => 'Danh sách sản phẩm'}                            
                            columns={[
                                {
                                    title: 'Tên sản phẩm',
                                    dataIndex: 'name',
                                    key: 'name'
                                },
                                {
                                    title: 'Đơn giá',
                                    dataIndex: 'price',
                                    key: 'price',
                                    render: (price) => price.toLocaleString() + ' đ'
                                },
                                {
                                    title: 'Số lượng',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                    render: (quantity, _record, index) => (
                                        <InputNumber
                                            value={quantity}
                                            type='number'
                                            defaultValue={1}
                                            min={1}
                                            onChange={(event) => {
                                                const newCart = cart.map((item, i) => {
                                                    if (i === index) {
                                                        return {
                                                            ...item,
                                                            quantity: event
                                                        }
                                                    }
                                                    return item
                                                })
                                                setCart(newCart)
                                            }}
                                        />
                                    )
                                },
                                {
                                    title: 'Thành tiền',
                                    dataIndex: 'total',
                                    key: 'total',
                                    render: (total) => total.toLocaleString() + ' đ'
                                },
                                {
                                    title: '',
                                    dataIndex: 'action',
                                    key: 'action',
                                    align: 'center',
                                    render: (_text, _record, index) => (
                                        <Button
                                            type='text'
                                            onClick={() => {
                                                const newCart = cart.filter((_item, i) => i !== index)
                                                setCart(newCart)
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                    )
                                }
                            ]}
                            dataSource={cart.map((item) => ({
                                ...item,
                                key: item.product.id,
                                total: item.product.price * item.quantity,
                                name: item.product.name,
                                price: item.product.price
                            }))}
                            bordered
                            pagination={false}
                            
                        />

                    </div>                    
                </div>
                
                {/* Customer information */}
                <div
                    className='sm:col-span-2 md:col-span-2 lg:col-span-1 grid grid-flow-row grid-cols-1 bg-white p-4 rounded-md shadow-md'
                >
                    <h1 className='font-medium'>
                        Thông tin khách hàng
                    </h1>

                    <Form.Item<FormType> 
                        name='name'
                        label='Họ tên'
                        className='col-span-1'
                        rules={[
                            {
                                required: true,
                                message: 'Họ tên không được để trống'
                            }
                        ]}
                    >
                        <Input
                            placeholder='Họ tên'
                        />
                    </Form.Item>

                    <Form.Item<FormType> 
                        name='phone'
                        label='Số điện thoại'
                        className='col-span-1'
                    >
                        <Input
                            placeholder='Số điện thoại'
                        />
                    </Form.Item>

                    <Form.Item<FormType> 
                        name='email'
                        label='Email'
                        className='col-span-1'
                    >
                        <Input
                            placeholder='Email'
                        />
                    </Form.Item>

                    <Form.Item<FormType> 
                        name='address'
                        label='Địa chỉ'
                        className='col-span-1'
                    >
                        <Input
                            placeholder='Địa chỉ'
                        />
                    </Form.Item>
                </div>


                <div
                    className='sm:col-span-2 md:col-span-2 lg:col-span-3 grid grid-flow-row gap-4 grid-cols-2 bg-white p-4 rounded-md shadow-md'
                >
                    
                    <h1 className='font-medium col-span-2'>
                        Thanh toán
                    </h1>

                    <Form.Item<FormType> 
                        name='description'
                        className='col-span-1'
                    >
                        <Input.TextArea
                            placeholder='Ghi chú đơn hàng'
                            autoSize={{ minRows: 4, maxRows: 10 }}
                            style={{ height: '100%' }}
                        />
                    </Form.Item>

                    {/* 
                        Review Order information
                    */}
                    <div
                        className='col-span-1'
                    >   
                        <div className='flex flex-col gap-4'>
                            <div className='flex justify-between'>
                                <p>Số lượng sản phẩm</p>
                                <p>{cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
                            </div>

                            <div className='flex justify-between'>
                                <p>Tổng tiền</p>
                                <p>{cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toLocaleString()} đ</p>
                            </div>

                            <div className='flex justify-between'>
                                <p className='line-through text-gray-500'>Giảm giá</p>
                                <p className='line-through text-gray-500'>0 đ</p>
                            </div>

                            <div className='flex justify-between'>
                                <p className='font-bold'>Phải thu</p>
                                <p className='font-bold'>{cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toLocaleString()} đ</p>
                            </div>
                        </div>
                    </div>

                    {/* line through */}
                    <Divider plain className='col-span-2'>
                    </Divider>

                    {/* Branch */}
                    <Form.Item<FormType> 
                        name='branchId'
                        label='Chi nhánh'
                        className='col-span-1'
                    >
                        <Select
                            options={getBranchesQuery.data?.map((branch) => ({
                                label: branch.name,
                                value: branch.id
                            }))}
                            placeholder='Chọn chi nhánh'
                            disabled={getBranchesQuery.data?.length === 1}
                        />
                    </Form.Item>

                    {/* Status */}
                    <Form.Item<FormType> 
                        name='statusId'
                        label='Trạng thái'
                        className='col-span-1'
                    >
                        <Select
                            options={getOrderStatusesQuery.data?.map((status) => ({
                                label: status.name,
                                value: status.id
                            }))}
                        />
                    </Form.Item>

                    <div
                        className='col-span-2'
                    >
                        <Button
                            type='primary'
                            htmlType='submit'
                        >
                            Tạo đơn hàng
                        </Button>

                        <Button
                            type='default'
                            onClick={() => navigate('/order')}
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            </Form>

        </div>
    )
}
