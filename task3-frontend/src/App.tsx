import React, { useState, useEffect } from 'react';
import {
    Layout,
    Button,
    Input,
    Space,
    Card,
    message,
    Typography,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    ApiOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { Task } from './types/Task';
import { taskService } from './services/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ExecutionHistory from './components/ExecutionHistory';
import 'antd/dist/reset.css';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();
    const [historyVisible, setHistoryVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (error: any) {
            message.error(error.response?.data || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            loadTasks();
            return;
        }

        setLoading(true);
        try {
            const results = await taskService.searchTasks(value);
            setTasks(results);
            if (results.length === 0) {
                message.info('No tasks found matching your search');
            }
        } catch (error: any) {
            message.error(error.response?.data || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setFormVisible(true);
    };

    const handleFormSuccess = () => {
        setFormVisible(false);
        setEditingTask(undefined);
        loadTasks();
    };

    const showExecutionHistory = (task: Task) => {
        setSelectedTask(task);
        setHistoryVisible(true);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    background: '#fff',
                    padding: '0 24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Space>
                    <ApiOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Title level={3} style={{ margin: 0 }}>Task Manager</Title>
                </Space>
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={loadTasks}
                        loading={loading}
                        aria-label="Refresh tasks"
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setFormVisible(true)}
                        aria-label="Create new task"
                    >
                        New Task
                    </Button>
                </Space>
            </Header>

            <Content style={{ padding: '24px', background: '#f5f5f5' }}>
                <Card>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Search
                            placeholder="Search tasks by name..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            style={{ maxWidth: 400 }}
                            aria-label="Search tasks"
                        />

                        <TaskList
                            tasks={tasks}
                            loading={loading}
                            onEdit={handleEdit}
                            onRefresh={loadTasks}
                            onShowHistory={showExecutionHistory}
                        />
                    </Space>
                </Card>

                <TaskForm
                    visible={formVisible}
                    onCancel={() => {
                        setFormVisible(false);
                        setEditingTask(undefined);
                    }}
                    onSuccess={handleFormSuccess}
                    task={editingTask}
                />

                {selectedTask && (
                    <ExecutionHistory
                        visible={historyVisible}
                        onCancel={() => setHistoryVisible(false)}
                        executions={selectedTask.taskExecutions}
                        taskName={selectedTask.name}
                    />
                )}
            </Content>
        </Layout>
    );
};

export default App;