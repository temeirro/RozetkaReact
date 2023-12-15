import React, { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { ICategory } from '../Model/ICategory';


interface CategoryProps {
    categories: ICategory[];
    updateCategoryList?: (newCategory: ICategory) => void; 
  }

interface DataType {
  key: React.Key;
  id: React.Key;
  name: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Image',
    dataIndex: 'image',
    render: (image: string) => <img src={`http://pv116.rozetka.com/upload/${image}`} alt="Category" style={{ maxWidth: '50px', maxHeight: '50px' }} />,
  }
];

const Category: React.FC<CategoryProps> = ({ categories }) => {
        const data: DataType[] = categories.map((category) => ({
        key: category.id.toString(),
        id: category.id,
        name: category.name,
        image: category.image,
      }));

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };



  return <Table rowSelection={rowSelection} columns={columns} dataSource={data} />;
};

export default Category;