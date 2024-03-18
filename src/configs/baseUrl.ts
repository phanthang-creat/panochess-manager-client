const BASE_URLS = {
  apiEndPoint: 'https://staging.manager.panochess.edu.vn/api',
  uploadEndPoint: 'https://staging.upload.panochess.edu.vn'
}

// const BASE_URLS = {
//   apiEndPoint: 'http://localhost:8081/api',
//   uploadEndPoint: 'http://localhost:8081'
// }

if (process.env.NODE_ENV === 'production') {
  BASE_URLS.apiEndPoint = 'https://manager.panochess.edu.vn/api'
  BASE_URLS.uploadEndPoint = 'https://upload.panochess.edu.vn'
}

export default BASE_URLS
