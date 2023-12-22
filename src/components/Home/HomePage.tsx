import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';
import {DeleteOutlined, LaptopOutlined, NotificationOutlined, UserOutlined, EditOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Breadcrumb, Button, Layout, Menu, Popconfirm, Table} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import {ColumnsType} from "antd/es/table";
import {ICategory} from '../Model/ICategory';



interface ICategoryItem {
    id: number;
    name: string;
    image: string;
}
const { Header, Content, Sider } = Layout;

const items1: { key: string; label: string; path: string }[] = [
    { key: '1', label: 'Home', path: '/' },
    { key: '2', label: 'Add Category', path: '/addCategory' },
    { key: '3', label: 'Register', path: '/register' }
];

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,

            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);
const HomePage = () => {
    const navigate = useNavigate();

    const[list, setList] = useState<ICategoryItem[]>([]);

    useEffect(() => {
        axios.get<ICategoryItem[]>("http://pv116.rozetka.com/api/categories")
            .then(resp=> {
                setList(resp.data);
            });
    },[]);

    const columns: ColumnsType<ICategoryItem> = [
        {
            title: '#',
            dataIndex: 'id'
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image: string) => {
                return (
                    <img src={`http://pv116.rozetka.com/upload/${image}`} width={100} alt={"Фото"}/>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this category?"
                    onConfirm={async () => {
                        try {
                            await axios.delete(`http://pv116.rozetka.com/api/categories/${record.id}`);
                            setList(list.filter(x=>x.id!=record.id));

                        } catch (error) {
                            console.error('Error fetching category details:', error);
                            throw error;
                        }
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button icon={<DeleteOutlined />}>
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
        {
            title: 'Edit',
            render: (category: ICategory) => (
                <Button icon={<EditOutlined />} type="default" onClick={() => handleEdit(category)}>
                    Edit
                </Button>
            ),
        },
    ];

    const handleEdit = (category: ICategory) => {
        navigate(`/EditCategory/${category.id}`);
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    //   items={items1}
                    // selectedKeys={[location.pathname]}
                    style={{ flex: 1, minWidth: 0 }}
                >
                    {items1.map((item) => (
                        <Menu.Item key={item.key}>
                            <Link to={item.path}>{item.label}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Header>
            <Layout>
                <Sider width={200}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={items2}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>HomePage</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        <Table dataSource={list} rowKey="id" columns={columns} />                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default HomePage;