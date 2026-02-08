import { Button, Card, Dropdown, Form, Input, Menu, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { DownOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import { format } from "@fullstack-blog/utils";
import { sleep } from "@fullstack-blog/utils";
import BaseLayout from "@/components/BaseLayout";
import chatAvatar from "@/assets/img/chat-avatar.png";

const Wrapper = styled.section`
    .msg-box {
        position: relative;
        padding: 12px 18px;
        min-height: 400px;
        max-height: 800px;
        overflow: auto;
        margin-bottom: 20px;
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background-color: #ccc;
        }

        &::-webkit-scrollbar-track {
            background: rgba(240, 227, 227, 0.5);
        }
        > li {
            + li {
                margin-top: 10px;
            }
            &.sys_msg {
                text-align: center;
                .content {
                    display: inline-block;
                    line-height: 30px;
                    padding: 0 15px;
                    border-radius: 3px;
                    background-color: #e2e2e2;
                    cursor: default;
                    font-size: 14px;
                }
            }
            &.mine {
                text-align: right;
                .chat-item-wrap {
                    .txt-wrap {
                        padding-right: 60px;
                        .chat-text span {
                            background-color: #5fb878;
                            color: #fff;
                            &::after {
                                right: -10px;
                                border-color: #5fb878 transparent transparent;
                            }
                        }
                    }
                    img {
                        float: right;
                    }
                }
            }
            &.others {
                text-align: left;
                .chat-item-wrap {
                    .txt-wrap {
                        padding-left: 60px;
                        .chat-text span {
                            background-color: #e2e2e2;
                            color: #000;
                            &::after {
                                left: -10px;
                                border-color: #e2e2e2 transparent transparent;
                            }
                        }
                    }
                    img {
                        float: left;
                    }
                }
            }
        }

        .chat-item-wrap {
            .txt-wrap {
                line-height: 24px;
                font-size: 12px;
                white-space: nowrap;
                color: #999;
                > span {
                    margin-right: 10px;
                }
                .chat-text {
                    margin-top: 5px;
                    span {
                        position: relative;
                        border-radius: 4px;
                        padding: 8px 15px;
                        font-size: 14px;
                        &::after {
                            content: "";
                            position: absolute;
                            top: 7px;
                            width: 0;
                            height: 0;
                            border-style: solid dashed dashed;
                            overflow: hidden;
                            border-width: 10px;
                        }
                    }
                }
            }
            img {
                width: 40px;
                height: 40px;
                border-radius: 100%;
            }
        }
    }
`;

const StyledCard = styled(Card)`
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

    .ant-card-head {
        background: #daf1ef;
    }

    .ant-card-body {
        padding: 10px;
    }
`;

const StyledForm = styled(Form)`
    display: flex;

    .form-item--content {
        flex: 1;
        margin: 0 16px 0 0;
    }
    .form-item--btn {
        .ant-form-item-control {
            line-height: 1;
        }

        .ant-form-item-control-input-content {
            display: flex;
            align-items: center;
        }
    }
`;

const SendButton = styled(Button)`
    margin-right: 6px;
`;

const StyledDropdown = styled(Dropdown)`
    display: none;
    @media screen and (min-width: 768px) {
        display: inline-block;
    }
`;

export const Component = () => {
    const socket = useRef(null);
    const msgBoxRef = useRef(null);
    const [triggerType, setTriggerType] = useState(1);
    const [msgList, setMsgList] = useState([]);
    const [form] = useForm();
    const inputRef = useRef(null);
    useEffect(() => {
        const createSocket = () => {
            socket.current = io(`${process.env.REACT_APP_SOCKET_SERVER}/chatroom`);
            socket.current.on("connect", () => {
                console.log("连上了");
            });
            socket.current.on("singleMsg", (msg) => {
                console.log(msg);
                switch (msg.event) {
                    case "greet_from_server":
                        setMsgList((prev) => [
                            ...prev,
                            {
                                time: format(new Date(), "HH:mm:ss"),
                                user: "系统通知",
                                content: msg.data.content,
                                type: "sys_msg",
                                customClass: "sys_msg",
                            },
                        ]);
                        break;
                    default:
                        break;
                }
            });
            socket.current.on("broadcastAll", (msg) => {
                console.log(msg);
            });
            socket.current.on("broadcast", (msg) => {
                console.log(msg);
                switch (msg.event) {
                    case "new_user_join":
                        setMsgList((prev) => [
                            ...prev,
                            {
                                time: format(new Date(), "HH:mm:ss"),
                                user: "系统通知",
                                content: `用户 ${msg.data.user} 加入了聊天室......`,
                                type: "sys_msg",
                                customClass: "sys_msg",
                            },
                        ]);
                        break;
                    case "someone_exit":
                        setMsgList((prev) => [
                            ...prev,
                            {
                                time: format(new Date(), "HH:mm:ss"),
                                user: "系统通知",
                                content: `用户 ${msg.data.user} 退出了聊天室......`,
                                type: "sys_msg",
                                customClass: "sys_msg",
                            },
                        ]);
                        break;
                    case "new_chat_content":
                        setMsgList((prev) => [
                            ...prev,
                            {
                                time: format(new Date(), "HH:mm:ss"),
                                user: msg.data.user,
                                content: msg.data.content,
                                type: "others",
                                customClass: "others",
                            },
                        ]);
                        break;
                    default:
                        break;
                }
            });
            socket.current.on("disconnect", () => {
                console.log("连接断开了");
            });
        };

        createSocket();

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);

    const sendChatContent = async () => {
        await form.validateFields();
        const value = form.getFieldValue("chatContent");
        socket.current.emit("chat", value);
        setMsgList((prev) => [
            ...prev,
            {
                time: format(new Date(), "HH:mm:ss"),
                user: "我说",
                content: value,
                type: "mine",
                customClass: "mine",
            },
        ]);
        form.resetFields();
        await sleep(0);
        inputRef.current.focus();
    };

    const onKeydownChat = (e) => {
        if ((triggerType === 1 && e.key === "Enter") || (triggerType === 2 && e.ctrlKey && e.key === "Enter")) {
            e.preventDefault();
            sendChatContent();
        }
    };

    return (
        <BaseLayout>
            <Wrapper>
                <StyledCard hoverable title={<span>一个简单的在线交流功能，正在升级中...</span>}>
                    <ul className="msg-box" ref={msgBoxRef}>
                        {msgList.map((msg, index) => (
                            <li key={index} className={msg.customClass}>
                                {msg.type === "sys_msg" && <span className="content">{msg.content}</span>}
                                {msg.type === "mine" && (
                                    <div className="chat-item-wrap">
                                        <img src={chatAvatar} alt="头像" />
                                        <div className="txt-wrap">
                                            <span>{msg.time}</span>
                                            {msg.user}
                                            <div className="chat-text">
                                                <span>{msg.content}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {msg.type === "others" && (
                                    <div className="chat-item-wrap">
                                        <img src={chatAvatar} alt="头像" />
                                        <div className="txt-wrap">
                                            <span>{msg.user}</span>
                                            {msg.time}
                                            <div className="chat-text">
                                                <span>{msg.content}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <StyledForm form={form}>
                        <Form.Item
                            name="chatContent"
                            rules={[{ required: true, message: "请输入聊天内容" }]}
                            className="form-item--content"
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.TextArea
                                ref={inputRef}
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                placeholder="输入内容后点击发送..."
                                onKeyDown={onKeydownChat}
                            />
                        </Form.Item>

                        <Form.Item className="form-item--btn">
                            <SendButton type="primary" ghost size="small" onClick={sendChatContent}>
                                发送
                            </SendButton>
                            <StyledDropdown
                                trigger={["click", "hover"]}
                                overlay={
                                    <Radio.Group value={triggerType} onChange={(e) => setTriggerType(e.target.value)}>
                                        <Menu onClick={(e) => setTriggerType(Number(e.key))}>
                                            <Menu.Item key="1">
                                                <Radio value={1}>按Enter键发送消息</Radio>
                                            </Menu.Item>
                                            <Menu.Item key="2">
                                                <Radio value={2}>按Ctrl+Enter键发送消息</Radio>
                                            </Menu.Item>
                                        </Menu>
                                    </Radio.Group>
                                }
                            >
                                <DownOutlined />
                            </StyledDropdown>
                        </Form.Item>
                    </StyledForm>
                </StyledCard>
            </Wrapper>
        </BaseLayout>
    );
};
