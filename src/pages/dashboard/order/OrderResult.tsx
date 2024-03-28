import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export const OrderResult = () => {

    
    const navigate = useNavigate()

    return (
        <Result
            status="success"
            title="Tạo đơn hàng thành công"
            subTitle={`Đơn hàng đã được tạo thành công`}
            extra={[
                <Button
                    type="primary"
                    key="console"
                    onClick={() => navigate('/order')}
                >
                    Danh sách đơn hàng
                </Button>,
                <Button
                    key="buy"
                    onClick={() => navigate('/order/creation')}
                >
                    Tạo đơn hàng khác
                </Button>,
    ]}
  />
    );
};