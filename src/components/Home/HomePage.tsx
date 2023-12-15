import { useEffect, useState } from "react";
import axios from "axios";
import { ICategory } from "../Model/ICategory";
import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link } from "react-router-dom";
import Category from "../Category/Category";

const { Header, Content, Sider } = Layout;

const items1: { key: string; label: string; path: string }[] = [
  { key: '1', label: 'Home', path: '/' },
  { key: '2', label: 'Add Category', path: '/addCategory' },
  { key: '3', label: 'Page3', path: '/' },
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

const HomePage: React.FC = () => {
  // const location = useLocation();
  const [list, setList] = useState<ICategory[]>([]);

  // const mapData = list.map(item => {
  //     return (
  //         <li key={item.id}>{item.name}</li>
  //     )
  // });


  useEffect(() => {
    axios.get<ICategory[]>("http://pv116.rozetka.com/api/categories")
      .then(resp => {
        setList(resp.data);

      });
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        <Sider width={200} style={{ background: colorBgContainer }}>
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
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Category categories={list} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HomePage;