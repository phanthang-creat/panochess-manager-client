import { FC, ReactNode, useState } from 'react'
import { Breadcrumb, Layout } from 'antd'
import clsx from 'clsx'
import { Sidebar, Header } from './components'
import { useLocation } from 'react-router-dom' // Import the useLocation hook

// import { Link } from 'react-router-dom' // Import the Link component
import '../../../configs/routes'

interface Props {
  children: ReactNode
}


const { Content } = Layout

const MainLayout: FC<Props> = ({ children }) => {

  const [collapsed, setCollapsed] = useState<boolean>(false)
  const location = useLocation() // Get the current location

  // Extract the path segments from the location
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '')

  return (
    <Layout>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      <Layout className={clsx('duration-200 transition-all', collapsed ? 'ml-[80px]' : 'ml-[250px]')}>
        {/* Header */}
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Breadcrumb */}
        <Breadcrumb className='p-4 bg-[#fafcfe]'
          items={pathSegments.map((segment, index) => (
            {
              key: index,
              href: `/${segment}`,
              title: segment

            }
          ))}
        />

        {/* Content */}
        <Content className='p-4 min-h-[calc(100vh_-_64px)] bg-[#fafcfe]'>{children}</Content>
      </Layout>
    </Layout>
  )
}


export default MainLayout
