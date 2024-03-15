import { Suspense } from 'react'
import { ConfigProvider } from 'antd'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SuspenseFallback, RouteGuard } from './components'
import { antdTheme, routes } from './configs'

function App() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ConfigProvider theme={antdTheme}>
        <Router>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<RouteGuard route={{ ...route, public: !!route.public }} />}
              />
            ))}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </Suspense>
  )
}

export default App
