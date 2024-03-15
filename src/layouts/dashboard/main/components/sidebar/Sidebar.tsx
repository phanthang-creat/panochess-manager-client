import { FC, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import clsx from 'clsx'
import { v4 as uuidv4 } from 'uuid'
import Logo from '~/assets/images/logo-transparent-256.png'
import { UserOutlined, BranchesOutlined, ReadOutlined } from '@ant-design/icons'

interface Props {
  collapsed: boolean
}

const { Sider } = Layout

const MENUS = [
  {
    key: uuidv4(),
    // icon: <UploadOutlined />,
    label: 'Học sinh',
    children: [
      {
        key: '/student',
        // icon: <UploadOutlined />,
        label: 'Danh sách học sinh'
      }
    ]
  },
  {
    key: uuidv4(),
    label: 'Giáo viên',
    children: [
      {
        key: '/teacher',
        label: 'Danh sách giáo viên'
      }
    ]
  },
  {
    key: uuidv4(),
    // icon: <UploadOutlined />,
    label: 'Lớp học',
    children: [
      {
        key: '/schedule',
        // icon: <UploadOutlined />,
        label: 'Danh sách lớp học'
      }
    ]
  },
  // {
  //   key: uuidv4(),
  //   // icon: <UploadOutlined />,
  //   label: 'Tuyển dụng',
  //   children: [
  //     {
  //       key: '/dashboard/recruitment-post',
  //       // icon: <UploadOutlined />,
  //       label: 'Bài viết tuyển dụng'
  //     }
  //   ]
  // },
  {
    key: uuidv4(),
    // icon: <UploadOutlined />,
    label: 'Quản lý sản phẩm',
    children: [
      {
        key: '/order',
        // icon: <UploadOutlined />,
        label: 'Đơn hàng'
        
      },
      {
        key: '/product',
        // icon: <UploadOutlined />,
        label: 'Sản phẩm'
      },
    ]
  },
  // {
  //   key: '/dashboard/application',
  //   // icon: <UploadOutlined />,
  //   label: 'Đơn tuyển dụng'
  // },
  // {
  //   key: '/dashboard/game',
  //   // icon: <UploadOutlined />,
  //   label: 'Ván đấu'
  // },
  {
    key: '/config',
    label: 'Cấu hình',
    children: [
      {
        key: '/config/account',
        label: 'Tài khoản',
        icon: <UserOutlined />,
        path: '/config/account'
      },
      {
          key: '/config/branch',
          label: 'Chi nhánh',
          icon: <BranchesOutlined />,
          path: '/config/branch',
      },
      {
          key: '/config/role',
          label: 'Vai trò',
          icon: <BranchesOutlined />,
          path: '/config/role',
      },
      {
          key: '/config/course',
          label: 'Khóa học',
          icon: <ReadOutlined />,
          path: '/config/course',
      },
      {
          key: '/config/product-categories',
          label: 'Danh mục sản phẩm',
          icon: <ReadOutlined />,
          path: '/config/product-categories',
      },
      {
          key: '/config/classroom',
          label: 'Lớp học',
          icon: <ReadOutlined />,
          path: '/config/classroom',
      },
    ]
  }
]

const Sidebar: FC<Props> = ({ collapsed }) => {
  const navigate = useNavigate()

  // States
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])

  // useEffect
  useEffect(() => {
    let isFindMenu = false

    MENUS.forEach((menu) => {
      if (isFindMenu) {
        return
      }

      if (menu.key === window.location.pathname) {
        setSelectedKeys([menu.key])
        isFindMenu = true
        return
      }

      if (!menu.children) {
        return
      }

      menu.children.forEach((childMenu) => {
        if (isFindMenu) {
          return
        }
        if (childMenu.key === window.location.pathname) {
          isFindMenu = true
          setSelectedKeys([childMenu.key])
          return
        }
        return
      })
    })
  }, [])

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className='!fixed left-0 top-0 bottom-0 h-screen  !bg-white'
      width={250}
    >
      <div
        className={clsx(
          'h-16 bg-[#333333] flex items-center',
          collapsed ? 'justify-center pl-0' : 'justify-start pl-7'
        )}
      >
        <Link to='/dashboard' className='flex items-center gap-2'>
          <img src={Logo} alt='' className='w-[32px] h-[32px] object-cover' />
          <h1
            className={clsx(
              'text-xl font-medium text-[#F1CA7B] duration-200 transition',
              collapsed ? 'hidden opacity-0' : 'inline-block opacity-100'
            )}
          >
            PANO CHESS
          </h1>
        </Link>
      </div>

      <Menu
        mode='inline'
        selectedKeys={selectedKeys}
        onSelect={(event) => {
          setSelectedKeys([event.key])
          navigate(event.key)
        }}
        items={MENUS}
        className='h-[calc(100vh_-_64px)] overflow-auto'
      />
    </Sider>
  )
}

export default Sidebar
