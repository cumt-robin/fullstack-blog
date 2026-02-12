import { Button, Space, Input, Form, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useAuthStore, selectCommentUserInfo } from "@/store";
import { EMAIL_VALIDATOR, REQUIRED_VALIDATOR_BLUR, URL_VALIDATOR } from "@fullstack-blog/utils";

const CommentUserInfoForm: React.FC<{
    topic: string;
    onCancel: () => void;
    onSuccess: () => void;
}> = ({ topic, onCancel, onSuccess }) => {
    const commentUserInfo = useAuthStore(selectCommentUserInfo);
    const setCommentUserInfo = useAuthStore((state) => state.setCommentUserInfo);

    const [form] = useForm();

    const rules = {
        nick_name: [REQUIRED_VALIDATOR_BLUR],
        email: [REQUIRED_VALIDATOR_BLUR, EMAIL_VALIDATOR],
        site_url: [URL_VALIDATOR],
    };

    const onClickCancel = () => {
        onCancel();
    };

    const onClickSave = async () => {
        await form.validateFields();

        setCommentUserInfo(form.getFieldsValue());

        message.success(`辛苦啦，可以去创建${topic}了！`);

        onSuccess();
    };

    return (
        <Form form={form} labelCol={{ style: { width: "100px" } }} initialValues={commentUserInfo || undefined}>
            <Form.Item label="昵称" name="nick_name" rules={rules.nick_name}>
                <Input placeholder="Hi，期待与您的互动" />
            </Form.Item>
            <Form.Item label="邮箱" name="email" rules={rules.email}>
                <Input placeholder="邮箱不会被公开，仅用于反馈与您相关的消息" />
            </Form.Item>
            <Form.Item label="个人网址" name="site_url" rules={rules.site_url}>
                <Input placeholder="个人网址会被公开，便于他人与您的交流与互动" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
                <Space>
                    <Button onClick={onClickCancel}>取消</Button>
                    <Button type="primary" onClick={onClickSave}>
                        保存
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default CommentUserInfoForm;
