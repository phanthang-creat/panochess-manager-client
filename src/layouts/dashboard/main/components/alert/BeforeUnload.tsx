// import { Modal } from "antd"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"

// export const BeforeUnload = ({
//     redirectUrl,
// }: {
//     redirectUrl: string
// }) => {
//     const [isDirty, setIsDirty] = useState(false)

//     const navigate = useNavigate()

//     useEffect(() => {
//         const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//             if (isDirty) {
//                 e.preventDefault()
//                 e.returnValue = ''
//             }
//         }

//         window.addEventListener('beforeunload', handleBeforeUnload)

//         return () => {
//             window.removeEventListener('beforeunload', handleBeforeUnload)
//         }
//     }
//     , [isDirty])

//     return (
//         <Modal
//             title={'Xác nhận rời khỏi trang'}
//             open={isDirty}
//             maskClosable={false}
//             okText='Rời khỏi'
//             cancelText='Ở lại'
//             onOk={() => navigate(redirectUrl)}
//             onCancel={() => {
//                 setIsDirty(false)
//             }}
//         >
//             <p>Bạn có chắc chắn muốn rời khỏi trang này?</p>
//         </Modal>
//     )
// }
