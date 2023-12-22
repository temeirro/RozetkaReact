import {useState} from "react";

import { PlusOutlined } from '@ant-design/icons';
import {Button, Col, Divider, Form, Input, message, Modal, Row, Upload} from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import axios from "axios";
import {IRegisterForm, IRegister, IUserLoginInfo} from "./authmodels.ts";
import {jwtDecode} from "jwt-decode";
import {imageConverter} from "./imageconvert.ts";
import {useNavigate} from "react-router-dom";


const RegisterPage = () => {
    const navigator = useNavigate();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [file, setFile] = useState<UploadFile | null>();
    const [form] = Form.useForm<IRegisterForm>();

    const [messageApi, contextHolder] = message.useMessage();
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({fileList: newFile}) => {
        const newFileList = newFile.slice(-1);
        setFile(newFileList[0]);
    };
    const onReset = () => {
        onClear();
    };

    const onFinish = async (values: IRegisterForm) => {
        const data: IRegister = { ...values, image: values.image?.thumbUrl };
        console.log("Registration data", data);

        try {
            // Register user
            await axios.post("http://pv116.rozetka.com/api/register", data);

            // Login user
            const loginData = {
                email: values.email, // Assuming email is a field in your IRegisterForm interface
                password: values.password // Assuming password is a field in your IRegisterForm interface
            };

            const login = await axios.post("http://pv116.rozetka.com/api/login", loginData);
            console.log("Login data", login.data);

            const { token } = login.data;
            const user: IUserLoginInfo = jwtDecode<IUserLoginInfo>(token);
            console.log("User info", user);

            localStorage.token = token;
            success();
            onClear();
            // Assuming navigator is a function that navigates to a specific route
            navigator("/");
        } catch {
            console.error("Registration failed", error);
            error();
        }
    };

    const onClear = ()=>{
        form.resetFields();
        setFile(null)
    }
    const onCancel = () => {
        navigator('/');
    }
    const success = () => {
        messageApi.open({
            type: 'success',
            duration: 10,
            content: 'Successful registration!',
        });
    };

    const error = () => {
        messageApi.open({
            type: 'error',
            duration: 10,
            content: 'Registration error!',
        });
    };

    return (
        <Row justify="center" style={{height: '70vh'}}>
            <Col span={8} style={{
                textAlign: 'center',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
            {contextHolder}
            <Divider>Registration</Divider>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                style={{minWidth: '100%', display: 'flex', flexDirection: "column", justifyContent: "center", padding:20}}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    htmlFor="name"
                    rules={[
                        {required: true, message: 'Enter your name!'},
                        {min: 2, message: 'Name length is minimum 2 symbols!'}
                    ]}
                >
                    <Input autoComplete="firstName"/>
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="lastName"
                    htmlFor="lastName"
                    rules={[
                        {required: true, message: 'Enter your last name!'},
                        {min: 2, message: 'Last name length is minimum 2 symbols!'}
                    ]}
                >
                    <Input autoComplete="lastName"/>
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    htmlFor="phone"
                    rules={[
                        {required: true, message: 'Enter your phone!'},
                        {min: 10, message: 'Phone length is minimum 10 symbols!'}
                    ]}
                >
                    <Input autoComplete="phone"/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    htmlFor="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Email format is wrong!',
                        },
                        {required: true, message: 'Enter your email!'},
                        {min: 5, message: 'Email length is minimum 5 symbols!'}
                    ]}
                >
                    <Input autoComplete="email" />
                </Form.Item>

                <Form.Item
                    label="Your Image"
                    name={"image"}
                    getValueFromEvent={imageConverter}
                >
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture-card"
                        onChange={handleChange}
                        onPreview={handlePreview}
                        accept="image/*"
                    >
                        {file ? null :
                            (
                                <div>
                                    <PlusOutlined/>
                                    <div style={{marginTop: 8}}>Upload</div>
                                </div>)
                        }
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Enter your password!', },
                        { min: 6, message: 'Password length is minimum 6 symbols!', },
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please, confirm your password!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>


                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>

                <Row style={{display: 'flex', justifyContent: 'center'}}>
                    <Button style={{margin:10}} type="primary" htmlType="submit">
                        Sign Up
                    </Button>
                    <Button  style={{margin:10}}  htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                    <Button  style={{margin:10}}  htmlType="button" onClick={onCancel}>
                        Cancel
                    </Button>
                </Row>
            </Form>
            </Col>

        </Row>
    )
}

export default  RegisterPage;