const StatisticPage = () => {
  return (
    <div>
      <h1 className='text-lg semibold'>Statistic Page
        
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Tổng quan</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-semibold">Tổng số học viên</h3>
              <p className="text-2xl font-semibold">100</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-semibold">Tổng số giáo viên</h3>
              <p className="text-2xl font-semibold">10</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Biểu đồ</h2>
          <div className="mt-4">
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticPage
