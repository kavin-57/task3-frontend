import { TaskExecution } from '../types/Task';
import React from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Tooltip } from 'antd';
import { PlayCircleOutlined, DeleteOutlined, EditOutlined, HistoryOutlined } from '@ant-design/icons';
import { Task } from '../types/Task';
import { taskService } from '../services/api';

interface TaskListProps {
    tasks: Task[];
    loading: boolean;
    onEdit: (task: Task) => void;
    onRefresh: () => void;
    onShowHistory: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onEdit, onRefresh, onShowHistory }) => {
    const [executingId, setExecutingId] = React.useState<string | null>(null);

    const handleExecute = async (taskId: string) => {
        setExecutingId(taskId);
        try {
            // Remove the unused variable by not assigning it
            await taskService.executeTask(taskId);
            message.success('Task executed successfully!');
            onRefresh();
        } catch (error: any) {
            message.error(error.response?.data || 'Failed to execute task');
        } finally {
            setExecutingId(null);
        }
    };

    const handleDelete = async (taskId: string) => {
        try {
            await taskService.deleteTask(taskId);
            message.success('Task deleted successfully!');
            onRefresh();
        } catch (error: any) {
            message.error(error.response?.data || 'Failed to delete task');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Command',
            dataIndex: 'command',
            key: 'command',
            render: (command: string) => (
                <code
                    style={{
                        fontSize: '12px',
                        background: '#f5f5f5',
                        padding: '4px 6px',
                        borderRadius: '3px',
                        display: 'inline-block',
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                    title={command}
                >
                    {command}
                </code>
            ),
        },
        {
            title: 'Executions',
            dataIndex: 'taskExecutions',
            key: 'executions',
            render: (executions: TaskExecution[]) => (
                <Tag
                    color={executions.length > 0 ? 'blue' : 'default'}
                    style={{ cursor: executions.length > 0 ? 'pointer' : 'default' }}
                    onClick={() => executions.length > 0 && onShowHistory(tasks.find(t => t.taskExecutions === executions)!)}
                >
                    {executions.length} runs
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 300,
            render: (_: any, record: Task) => (
                <Space size="small">
                    <Tooltip title="Execute task">
                        <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            loading={executingId === record.id}
                            onClick={() => handleExecute(record.id)}
                            size="small"
                            aria-label={`Execute task ${record.name}`}
                        >
                            Run
                        </Button>
                    </Tooltip>

                    <Tooltip title="View execution history">
                        <Button
                            icon={<HistoryOutlined />}
                            onClick={() => onShowHistory(record)}
                            size="small"
                            disabled={record.taskExecutions.length === 0}
                            aria-label={`View history for ${record.name}`}
                        >
                            History
                        </Button>
                    </Tooltip>

                    <Tooltip title="Edit task">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            size="small"
                            aria-label={`Edit task ${record.name}`}
                        >
                            Edit
                        </Button>
                    </Tooltip>

                    <Tooltip title="Delete task">
                        <Popconfirm
                            title="Are you sure to delete this task?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                            aria-label="Confirm task deletion"
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                aria-label={`Delete task ${record.name}`}
                            >
                                Delete
                            </Button>
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            loading={loading}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            scroll={{ x: 800 }}
            locale={{ emptyText: 'No tasks found' }}
        />
    );
};

export default TaskList;