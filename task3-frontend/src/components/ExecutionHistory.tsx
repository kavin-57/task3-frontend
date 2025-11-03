import React from 'react';
import { Modal, Timeline, Tag, Space, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { TaskExecution } from '../types/Task';

// Remove the unused Text import - delete this line:
// const { Text } = Typography;

interface ExecutionHistoryProps {
    visible: boolean;
    onCancel: () => void;
    executions: TaskExecution[];
    taskName: string;
}

const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({
                                                               visible,
                                                               onCancel,
                                                               executions,
                                                               taskName,
                                                           }) => {
    const getExecutionStatus = (execution: TaskExecution) => {
        if (execution.output.includes('Error') || execution.output.includes('Failed')) {
            return { icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />, color: 'red' };
        }
        return { icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />, color: 'green' };
    };

    const formatDuration = (start: string, end: string) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const duration = endTime - startTime;
        return `${duration}ms`;
    };

    return (
        <Modal
            title={`Execution History - ${taskName}`}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            aria-labelledby="execution-history-title"
        >
            <div id="execution-history-title" style={{ display: 'none' }}>
                Execution History for {taskName}
            </div>

            {executions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <ClockCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                    <p>No execution history available</p>
                </div>
            ) : (
                <Timeline>
                    {executions.map((exec, index) => {
                        const status = getExecutionStatus(exec);
                        return (
                            <Timeline.Item
                                key={index}
                                dot={status.icon}
                                color={status.color}
                            >
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <div>
                                        <strong>Started:</strong> {new Date(exec.startTime).toLocaleString()}
                                        <br />
                                        <strong>Ended:</strong> {new Date(exec.endTime).toLocaleString()}
                                        <br />
                                        <strong>Duration:</strong> {formatDuration(exec.startTime, exec.endTime)}
                                    </div>
                                    <div>
                                        <Tag color={status.color}>
                                            Output
                                        </Tag>
                                        <pre
                                            style={{
                                                background: '#f5f5f5',
                                                padding: '12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                marginTop: '8px',
                                                maxHeight: '200px',
                                                overflow: 'auto',
                                                border: '1px solid #d9d9d9',
                                            }}
                                            aria-label="Command output"
                                        >
                      {exec.output}
                    </pre>
                                    </div>
                                </Space>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            )}
        </Modal>
    );
};

export default ExecutionHistory;