import { Button, Col, Row } from 'antd';
import { useEffect } from 'react';

const Modal = ({ title = '', data = {}, open = false, setOpen = () => {} }) => {
    useEffect(() => {
        return () => (data = {});
    });
    return (
        <>
            <div
                onClick={() => setOpen(false)}
                className={`fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] ${
                    open
                        ? 'transition delay-150 duration-300 ease-in-out opacity-100 z-[2]'
                        : 'transition delay-150 duration-300 ease-in-out opacity-0 z-[-1]'
                }`}
            ></div>
            <div
                style={{
                    boxShadow:
                        '0 3px 1px -2px rgb(41 66 112 / 12%), 0 2px 2px 0 rgb(41 66 112 / 12%), 0 1px 5px 0 rgb(41 66 112 / 12%)',
                }}
                className={`bg-white rounded-[10px] fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] md:w-min w-[calc(100%-30px)] ${
                    open
                        ? 'transition delay-150 duration-300 ease-in-out rotate-0 opacity-100 scale-100 z-[2]'
                        : 'transition delay-150 duration-300 ease-in-out opacity-0 rotate-90 scale-0 z-[-1]'
                }`}
            >
                <div className="flex justify-between items-center border-b-[1px] border-b-[#e6edf0]">
                    <h2 className="m-0 ml-5">{title}</h2>
                    <Button onClick={() => setOpen(false)} type="link">
                        X
                    </Button>
                </div>
                <Row
                    gutter={[16, 16]}
                    style={{ marginLeft: 0, marginRight: 0 }}
                    className="md:min-w-[700px] min-w-full p-4 max-h-[500px] overflow-y-scroll overflow-x-hidden"
                >
                    {Object.keys(data).map((key) => (
                        <>
                            <Col className="font-bold" span={24} sm={{ span: 12 }}>
                                {key}:
                            </Col>
                            <Col span={24} sm={{ span: 12 }}>
                                {key.toLowerCase().includes('ảnh') ? (
                                    <img className="w-[100px]" src={data[key]} alt={key} />
                                ) : (
                                    data[key]
                                )}
                            </Col>
                        </>
                    ))}
                </Row>
            </div>
        </>
    );
};

export default Modal;
