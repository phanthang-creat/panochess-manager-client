import { lazy } from 'react'
import ConfigPage from '~/pages/dashboard/config/ConfigPage'
// import AccountCreationPage from '~/pages/dashboard/config/account/AccountCreationPage'
// import AccountPage from '~/pages/dashboard/config/account/AccountPage'
import CourseCreationPage from '~/pages/dashboard/config/course/CourseCreationPage'
import CoursePage from '~/pages/dashboard/config/course/CoursePage'
import ProductCategoryCreationPage from '~/pages/dashboard/config/product-categories/ProductCategoriesCreation'
import ProductCategoryPage from '~/pages/dashboard/config/product-categories/ProductCategoriesPage'
import StudentCreationPage from '~/pages/dashboard/student/information/StudentCreationPage'
import StudentEditPage from '~/pages/dashboard/student/information/StudentEditPage'
import { StudentListPage } from '~/pages/dashboard/student/information/StudentListPage'
import TeacherCreationPage from '~/pages/dashboard/teacher/information/TeacherCreationPage'
import TeacherEditPage from '~/pages/dashboard/teacher/information/TeacherEditPage'
import { TeacherListPage } from '~/pages/dashboard/teacher/information/TeacherListPage'
import { SchedulePage } from '~/pages/dashboard/schedule/SchedulePage'
import { ProductListPage } from '~/pages/dashboard/product/ProductPage'
import { ProductCreationPage } from '~/pages/dashboard/product/ProductCreationPage'
import { ProductEditionPage } from '~/pages/dashboard/product/ProductEditPage'
import { OrderListPage } from '~/pages/dashboard/order/OrderPage'
import { OrderCreationPage } from '~/pages/dashboard/order/OrderCreationPage'
import ClassroomPage from '~/pages/dashboard/config/classroom/ClassroomPage'
import ClassroomCreationPage from '~/pages/dashboard/config/classroom/ClassroomCreationPage'
// Dashboard
const DashboardMainLayout = lazy(() => import('~/layouts/dashboard/main/MainLayout'))
const DashboardAuthLayout = lazy(() => import('~/layouts/dashboard/auth/AuthLayout'))

const DashboardStatisticPage = lazy(() => import('~/pages/dashboard/statistic/StatisticPage'))
const DashboardLoginPage = lazy(() => import('~/pages/dashboard/login/LoginPage'))
// const DashboardFooterPage = lazy(() => import('~/pages/dashboard/footer/FooterPage'))

// const DashboardHomePage = lazy(() => import('~/pages/dashboard/home/HomePage'))
const DashboardCoursePage = lazy(() => import('~/pages/dashboard/course/CoursePage'))
// const DashboardPostPage = lazy(() => import('~/pages/dashboard/post/PostPage'))
// const DashboardPostCreationPage = lazy(() => import('~/pages/dashboard/post/PostCreationPage'))



const routes = [
  // Dashboard pages
  {
    path: '',
    layout: DashboardMainLayout,
    component: DashboardStatisticPage,
    public: false
  },
  {
    path: '/login',
    layout: DashboardAuthLayout,
    component: DashboardLoginPage,
    public: true
  },
  // {
  //   path: '/home',
  //   layout: DashboardMainLayout,
  //   component: DashboardHomePage,
  //   public: false
  // },
  {
    path: '/course',
    layout: DashboardMainLayout,
    component: DashboardCoursePage,
    public: false
  },
  {
    path: '/config',
    layout: DashboardMainLayout,
    component: ConfigPage,
    public: false
  },
  {
    path: 'config/course',
    layout: DashboardMainLayout,
    component: CoursePage,
    public: false
  },
  {
    path: 'config/course/update/:id',
    layout: DashboardMainLayout,
    component: CourseCreationPage,
    public: false
  },
  {
    path: 'config/course/creation',
    layout: DashboardMainLayout,
    component: CourseCreationPage,
    public: false
  },
  {
    path: 'config/classroom',
    layout: DashboardMainLayout,
    component: ClassroomPage,
    public: false
  },
  {
    path: 'config/classroom/:id',
    layout: DashboardMainLayout,
    component: ClassroomCreationPage,
    public: false
  },
  {
    path: 'config/classroom/creation',
    layout: DashboardMainLayout,
    component: ClassroomCreationPage,
    public: false
  },
  {
    path: 'config/product-categories',
    layout: DashboardMainLayout,
    component: ProductCategoryPage,
    public: false
  },
  {
    path: 'config/product-categories/update/:id',
    layout: DashboardMainLayout,
    component: ProductCategoryCreationPage,
    public: false
  },
  {
    path: 'config/product-categories/creation',
    layout: DashboardMainLayout,
    component: ProductCategoryCreationPage,
    public: false
  },
  {
    path: '/product',
    layout: DashboardMainLayout,
    component: ProductListPage,
    public: false
  },
  {
    path: '/product/creation',
    layout: DashboardMainLayout,
    component: ProductCreationPage,
    public: false
  },
  {
    path: '/product/:id',
    layout: DashboardMainLayout,
    component: ProductEditionPage,
    public: false
  },
  {
    path: '/order',
    layout: DashboardMainLayout,
    component: OrderListPage,
  },
  {
    path: '/order/creation',
    layout: DashboardMainLayout,
    component: OrderCreationPage,
  },
  { 
    path: '/student',
    layout: DashboardMainLayout,
    component: StudentListPage,
    public: false
  },
  {
    path: '/student/creation',
    layout: DashboardMainLayout,
    component: StudentCreationPage,
    public: false
  },
  {
    path: '/student/:id',
    layout: DashboardMainLayout,
    component: StudentEditPage,
    public: false
  },
  {
    path: '/teacher',
    layout: DashboardMainLayout,
    component: TeacherListPage,
    public: false
  },
  {
    path: '/teacher/creation',
    layout: DashboardMainLayout,
    component: TeacherCreationPage,
    public: false
  },
  {
    path: '/teacher/:id',
    layout: DashboardMainLayout,
    component: TeacherEditPage,
    public: false
  },
  {
    path: '/schedule',
    layout: DashboardMainLayout,
    component: SchedulePage,
    public: false
  }

]

export default routes
