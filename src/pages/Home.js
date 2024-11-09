import React, {useEffect, useState} from 'react';

import {
    Button,
    Col,
    Collapse,
    Form,
    Input,
    Row,
    Table,
    Spin,
    Tag,
    Typography,
    Space,
    Modal,
    notification
} from 'antd';
import EditUserForm from "../components/EditUserForm";
import {
    ColumnHeightOutlined,
    LoadingOutlined,
    ReloadOutlined,
    SettingOutlined,
    StepForwardOutlined
} from "@ant-design/icons";
import AddUserForm from "../components/AddUserForm";

const { Panel } = Collapse;

function QuestionCircleOutlined() {
    return null;
}

function SettingFilled() {
    return null;
}

const QueryTable = () => {

    const [dataSource, setDataSource] = useState([]);
    const [form] = Form.useForm();
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [pageSize, setPageSize] = useState(5); // 每页条目数

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    // 需要在页面加载时执行的函数
    const myFunction = () => {
        console.log('欢迎来到我的项目');
        resetForm();
    };

    // 展示编辑弹窗
    const showEditModal = (mode) => {
        setIsEditMode(mode === 'edit');
        setIsEditModalVisible(true);
    };

    // 展示删除弹窗
    const showDeleteModal = (mode) => {
        setIsDeleteMode(mode === 'delete');
        setIsDeleteModalVisible(true);
    };

    // 展示添加弹窗
    const showAddModal = (mode) => {
        setIsAddMode(mode === 'delete');
        setIsAddModalVisible(true);
    };


    // 关闭所有弹窗
    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsDeleteModalVisible(false);
        setIsAddModalVisible(false);
    };

    const handleDelete = async (key) => {
        console.log("showModal的record为：" + key.id);

        // 关闭弹窗
        handleCancel();

        console.log(key);
        console.log(key.id);

        // 组装 发往后端 进行查询
        let obj = {
            id: "",
            isDelete: "",
            name: "",
            gender: "",
            mobile: "",
            email: "",
            status: "",
            createdAt: "",
            updateAt: "",
            sortField: "",
            sortOrder: ""
        }



        console.log('查询条件:', key);
        setLoading(true);

        // 组装数据
        obj = Object.assign(obj, key)
        console.log('组装后的查询条件:', key);


        try {
            // 假设后端接口为 /api/delete
            const response = await fetch('http://localhost:8080/api/backend/v1/delete-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 指定内容类型
                },
                body: JSON.stringify(obj), // 将对象转换为 JSON 字符串
            });

            const data = await response.json(); // 解析 JSON 响应

            // 显示删除成功的提示
            notification.success({
                message: '删除成功',
                description: '记录已成功删除。',
            });

            // 打印在控制台
            console.log('删除成功:', data);

        } catch (error) {

            // 显示删除失败的提示
            notification.error({
                message: '删除失败',
                description: '记录删除失败。',
            });

            console.error('删除失败:', error);

        } finally {
            // 进行刷新
            resetForm();
            setLoading(false);
        }

    };

    // 提交编辑表单后回调信息
    const handleUpdateUser = () => {
        // 关闭弹窗
        handleCancel();
        // 自动刷新
        myFunction();
    };

    // 使用 useEffect 在组件挂载时调用 myFunction
    useEffect(() => {
        myFunction();
    }, []); // 空依赖数组意味着这个 effect 只在组件首次渲染时执行

    // 查询函数
    const onFinish = async (values) => {

        // 组装 发往后端 进行查询
        let obj = {
            isDelete: 0,
            name: "",
            gender: "",
            mobile: "",
            email: "",
            status: 0,
            createdAt: "",
            updateAt: "",
            current: 0,
            pageSize: 0,
            sortField: "",
            sortOrder: ""
        }

        console.log('查询条件:', values);
        setLoading(true);

        // 组装数据
        obj = Object.assign(obj,values)

        try {
            const response = await fetch('http://localhost:8080/api/backend/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj), // 发送查询条件
            });

            const data = await response.json();

            // 得到数据
            console.log(data.data.records)

            // 挂载在页面上
            setDataSource(data.data.records);

            console.log(dataSource);
        } catch (error) {
            console.error('请求数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        form.resetFields();
        setDataSource([]);
        onFinish();
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const handleEdit = (record) => {
        console.log('Editing:', record);
        // Implement edit functionality here
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (text) => (text === "1" ? 'Male' : 'Female'),
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => renderStatus(status), // 使用渲染函数
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => formatDate(text), // 格式化日期
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Space>
                        <Typography
                            style={{ color: 'blue', cursor: 'pointer' }}
                            onClick={() => showEditModal('edit')}
                        >
                            Edit
                        </Typography>
                        <Typography
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => showDeleteModal('delete')}
                        >
                            Delete
                        </Typography>

                        {/*编辑模型*/}
                        <Modal
                            title="EDIT USER"
                            visible={isEditModalVisible}
                            footer={null}
                            onCancel={handleCancel}
                            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} // 设置遮罩颜色
                        >
                            <EditUserForm user={record} onSubmit={handleUpdateUser} />
                        </Modal>

                        {/*删除模型*/}
                        <Modal
                            title="确定要删除吗"
                            visible={isDeleteModalVisible}
                            onOk={() => handleDelete(record)} // 使用当前行的 record
                            onCancel={handleCancel}
                            okText="Yes"
                            cancelText="No"
                            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} // 设置遮罩颜色
                        >
                            <p>您确定要删除这个记录吗？</p>
                        </Modal>
                    </Space>
                </>
            ),
        },
    ];

    // 控制页面展示
    const handleTableChange = (page, pageSize) => {
        setCurrentPage(page); // 更新当前页码
        setPageSize(pageSize); // 更新每页显示的数据量
    };

    return (
        <div style={{ padding: '20px' }}>
            <Collapse activeKey={collapsed ? [] : ['1']} onChange={toggleCollapse}>
                <Panel header="查询表格" key="1">
                    <Form form={form} layout="inline" onFinish={onFinish}>
                        <Row gutter={200}>
                            <Col span={8}>
                                <Form.Item name="name" label="Name" rules={[{  message: '请输入姓名!' }]}>
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="mobile" label="Mobile" rules={[{ message: '请输入手机号!' }]}>
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="email" label="Email" rules={[{  type: 'email', message: '请输入有效的邮箱!' }]}>
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item style={{ width: '100%', textAlign: 'right', marginTop: 16 }} colSpan={3}>
                            <Button style={{ marginLeft: 8 }} onClick={resetForm}>
                                重置
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                查询
                            </Button>
                            <span
                                onClick={toggleCollapse}
                                style={{ cursor: 'pointer', color: 'blue' }}
                            > {collapsed ? '展开' : '收起^'}
                            </span>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>

            {/* 夹层区域 */}
            <Row justify="end" align="middle">

                {/* 按钮和图标区域 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* 按钮 */}
                    <Button
                        type="primary"
                        style={{ marginTop: '20px', marginBottom: '1px' }}
                        onClick={showAddModal}
                        onCancel={handleCancel}
                    >
                        + 添加
                    </Button>
                    <Modal
                        title="添加用户"
                        visible={isAddModalVisible}
                        onCancel={handleCancel}
                        footer={null} // 自定义footer
                    >
                        <AddUserForm />
                    </Modal>

                    {/* 图标 */}
                    <ReloadOutlined style={{ fontSize: '24px', marginTop: '20px' }} />
                    <ColumnHeightOutlined style={{ fontSize: '24px', marginTop: '20px' }} />
                    <SettingOutlined style={{ fontSize: '24px' , marginTop: '20px'}} />
                </div>
            </Row>

            {/*表格区域*/}
            {loading ? (
                <Spin style={{ marginTop: '20px' }} />
            ) : (

                <Table
                    dataSource={dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // 分页数据
                    columns={columns}
                    style={{ marginTop: '20px' }}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: dataSource.length, // 数据总长度
                        onChange: handleTableChange, // 页码变化时调用
                    }}
                />
            )}
        </div>
    );
};

// 展示状态
const renderStatus = (status) => {
    if (status === "1") {
        return <Tag color="green">enable</Tag>;
    }
    return <Tag color="red">disable</Tag>;
};

// 展示时间
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 格式化为 YYYY-MM-DD HH:mm:ss
};

export default QueryTable;
