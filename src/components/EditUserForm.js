import React, { useState } from 'react';
import { Form, Input, Button, Select, Radio, DatePicker, notification } from 'antd';

const { Option } = Select;

const EditUserForm = ({ user, onSubmit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // 提交表单函数
    const handleFinish = async (values) => {

        console.log('传入的',values);

        console.log('传入的id',values.id);

        // 组装 发往后端 进行查询
        let obj = {
            name: "",
            id: "",
            email: "",
            mobile: "",
            gender: "",
            status: "",
            date_string: ""
        }

        console.log('查询条件:', values);
        setLoading(true);

        // 组装数据
        obj = Object.assign(obj, values)
        console.log('组装后的查询条件:', obj);

        if(values.status == "enable"){
            obj.status="1";
        }else    obj.status="0";

        setLoading(true);
        try {

            const response = await fetch('http://localhost:8080/api/backend/v1/update-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 指定内容类型
                },
                body: JSON.stringify(obj), // 将对象转换为 JSON 字符串
            });

            console.log('更新的用户信息:', response.data);

            notification.success({
                message: '提交成功',
                description: '用户信息已成功更新。',
            });
            if (onSubmit) {
                onSubmit(response.data);
            }
            form.resetFields(); // Reset the form fields after successful submission
        } catch (error) {
            console.error('更新用户信息失败:', error);
            const errorMessage = error.response?.data?.message || '请检查网络连接或重试。'; // Get error message from response if available
            notification.error({
                message: '提交失败',
                description: errorMessage,
            });
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={user}
            onFinish={handleFinish}
        >

            <Form.Item
                label="id"
                name="id"
                rules={[{ required: true, message: '请输入姓名!' }]}
                style={{ display: 'none' }} // 隐藏该字段
            >
                <Input placeholder="请输入姓名" />
            </Form.Item>

            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: '请输入姓名!' }]}
            >
                <Input placeholder="请输入姓名" />
            </Form.Item>


            <Form.Item
                name="Password"
                label="Password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="Password Confirnation"
                label="Password Confirnation"
                dependencies={['password']}
                rules={[
                    { required: true, message: '请确认您的密码' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('Password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次输入的密码不一致'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: '请输入电子邮件!' },
                    { type: 'email', message: '请输入有效的电子邮件地址!' }
                ]}
            >
                <Input placeholder="请输入电子邮件" />
            </Form.Item>

            <Form.Item
                label="Mobile"
                name="mobile"
                rules={[{ required: true, message: '请输入手机号码!' }]}
            >
                <Input placeholder="请输入手机号码" />
            </Form.Item>

            <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: '请选择性别!' }]}
            >
                <Select placeholder="请选择性别">
                    <Option value="male">男</Option>
                    <Option value="female">女</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态!' }]}
            >
                <Radio.Group>
                    <Radio value="enable">enable</Radio>
                    <Radio value="disable">disable</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label="Date String"
                name="date"
                rules={[{ required: true, message: '请选择日期!' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditUserForm;
