import React from 'react';
import {Form, Input, Button, Radio, DatePicker, message, Select} from 'antd';

const { Option } = Select;


const AddUserForm = () => {
    const onFinish = async (values) => {

        // 组装 发往后端 进行查询
        let obj = {
            name: "",
            password: "",
            passwordConfirmation: "",
            email: "",
            mobile: "",
            gender: "",
            status: "",
            date_string: "",
        }

        // 组装数据
        obj = Object.assign(obj, values)
        console.log('组装后的添加数据:', values);

        if(values.gender === "female"){
            values.gender=2;
        }else    values.gender=1;

        if(values.status === "enable"){
            values.status=1
        }else    values.status=0;

        console.log('发往后端的数据:', obj);

        try {
            // 假设这是你的后端 API
            await fetch('http://localhost:8080/api/backend/v1/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    dateString: values.dateString.format('YYYY-MM-DD'), // 格式化日期
                }),
            });
            message.success('用户添加成功');
        } catch (error) {
            message.error('添加用户失败，请重试');
        } finally {
            // 刷新页面
            window.location.reload();
        }
    };

    return (
        <Form
            name="addUserForm"
            onFinish={onFinish}
            layout="vertical"
            style={{ maxWidth: 400, margin: '0 auto' }}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: '请输入姓名' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="passwordConfirmation"
                label="Password Confirmation"
                rules={[{ required: true, message: '请确认密码' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="mobile"
                label="Moblie"
                rules={[{ required: true, message: '请输入手机号码' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: '请选择性别!' }]}
            >
                <Select placeholder="请选择性别">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
            >
                <Radio.Group>
                    <Radio value="enable">enable</Radio>
                    <Radio value="disable">disable</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                name="dateString"
                label="日期"
                rules={[{ required: true, message: '请选择日期' }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddUserForm;
