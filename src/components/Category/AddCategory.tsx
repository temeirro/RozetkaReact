import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Input, Button, Row, Col, Divider, Form, message, UploadProps, UploadFile, Upload} from 'antd';
import {RcFile, UploadChangeParam} from "antd/es/upload";
import {useState} from "react";
import {PlusOutlined} from '@ant-design/icons';
import {ICategoryCreate} from "./types.ts";

const AddCategory = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);

    type FieldType = {
        name?: string;
    };
    const onSubmit = async (values: any) => {
        if (file == null) {
            message.error("Choose your photo!");
            return;
        }

        try {
            // Fetch all existing categories
            const response = await axios.get("http://pv116.rozetka.com/api/categories");
            const existingCategories = response.data;

            // Check if the entered category name already exists
            const isCategoryExists = existingCategories.some(
                (category: any) => category.name.toLowerCase() === values.name.toLowerCase()
            );

            if (isCategoryExists) {
                message.error("Category with this name already exists!");
                return;
            }

            // If the category doesn't exist, proceed to add it
            const model: ICategoryCreate = {
                name: values.name,
                image: file,
            };

            await axios.post("http://pv116.rozetka.com/api/categories", model, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/");
        } catch (ex) {
            message.error('Error adding category!');
        }
    };

    const handleCancel = () => {
        navigate('/');
    }
    const onSubmitFailed = (errorInfo: any) => {
        console.log("Error Form data", errorInfo);
    }
    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Оберіть файл зображення!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        console.log("is select", isImage && isLt2M);
        return isImage && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        const file = info.file.originFileObj as File;
        setFile(file);
    };

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    return (
        <>
            <Row justify="center" style={{height: '70vh'}}>
                <Col span={8} style={{
                    textAlign: 'center',
                    padding: '24px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>

                <Divider>Add Category</Divider>

                    <Form
                        labelCol={{span: 4}}
                        wrapperCol={{span: 16}}
                        style={{maxWidth: 600}}
                        initialValues={{remember: true}}
                        onFinish={onSubmit}
                        onFinishFailed={onSubmitFailed}>
                        <Form.Item<FieldType>
                            label="Name"
                            name="name"
                            rules={[{required: true, message: 'Enter name!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            // action="https://run.mocky.io/v3/435e224c-4/4fb-4773-9faf-380c5e6a2188"
                            action="#"

                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            accept={"image/*"}

                        >
                            {file ? <img src={URL.createObjectURL(file)} alt="avatar"
                                         style={{width: '100%'}}/> : uploadButton}
                        </Upload>

                        <Row style={{display: 'flex', justifyContent: 'center'}}>
                            <Button style={{margin:10}} type="primary" htmlType="submit">
                                Add Category
                            </Button>
                            <Button style={{margin:10}} onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Row>


                    </Form>
                </Col>
            </Row>
        </>
    );
};
export default AddCategory;