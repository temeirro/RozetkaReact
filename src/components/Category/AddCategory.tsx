import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button, Row, Col } from 'antd';

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const handleAddCategory = () => {
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", categoryImage);

    axios.post("http://pv116.rozetka.com/api/categories", formData)
        .then((response) => {
          setCategoryName("");
          setCategoryImage("");
          navigate('/');
        })
        .catch((error) => {
          console.error("Error adding category:", error);
        });
  };

  const handleCancel = () => {
    navigate('/');
  }

  return (
    <Row justify="center"  style={{ height: '100vh' }}>
      <Col span={8} style={{ textAlign: 'center', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginBottom: '16px' }}>Add Category</h2>
        <Input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <Input  style={{ marginTop: '10px' }}
            type="file"
            placeholder="Category image"
            onChange={(e) => setCategoryImage(e.target.files[0])}
        />

        <Row justify="space-between" style={{ marginTop: '16px' }}>
          <Button type="primary" onClick={handleAddCategory}>Add Category</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Row>
      </Col>
    </Row>
  );
};

export default AddCategory;
