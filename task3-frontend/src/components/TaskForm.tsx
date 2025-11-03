import React from 'react';
import { Modal, Form, Input, Button, message, Space } from 'antd';
import { Task, CreateTaskRequest } from '../types/Task';
import { taskService } from '../services/api';

interface TaskFormProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    task?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSuccess, task }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (task) {
            form.setFieldsValue(task);
        } else {
            form.resetFields();
        }
    }, [task, form]);

    const handleSubmit = async (values: CreateTaskRequest) => {
        setLoading(true);
        try {
            await taskService.saveTask(values);
            message.success(task ? 'Task updated successfully!' : 'Task created successfully!');
            onSuccess();
        } catch (error: any) {
            message.error(error.response?.data || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={task ? 'Edit Task' : 'Create New Task'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={task}
            >
                <Form.Item
                    label="Task ID"
                    name="id"
                    rules={[
                        { required: true, message: 'Please enter task ID' },
                        { pattern: /^[a-zA-Z0-9_-]+$/, message: 'ID can only contain letters, numbers, hyphens, and underscores' }
                    ]}
                >
                    <Input
                        placeholder="Enter unique task ID"
                        aria-required="true"
                    />
                </Form.Item>

                <Form.Item
                    label="Task Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter task name' }]}
                >
                    <Input
                        placeholder="Enter task name"
                        aria-required="true"
                    />
                </Form.Item>

                <Form.Item
                    label="Owner"
                    name="owner"
                    rules={[{ required: true, message: 'Please enter owner name' }]}
                >
                    <Input
                        placeholder="Enter owner name"
                        aria-required="true"
                    />
                </Form.Item>

                <Form.Item
                    label="Command"
                    name="command"
                    rules={[{ required: true, message: 'Please enter command' }]}
                >
                    <Input.TextArea
                        placeholder="Enter shell command (e.g., echo Hello World)"
                        rows={3}
                        aria-required="true"
                    />
                </Form.Item>

                <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {task ? 'Update Task' : 'Create Task'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskForm;