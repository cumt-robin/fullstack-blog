import { Form, Input, Image, Button, message } from "antd";
import { useWatch } from "antd/es/form/Form";
import { categoryService } from "@fullstack-blog/services";
import { CategoryDTO } from "@fullstack-blog/types";
import { useAsyncLoading } from "@/hooks/async";

const Edit: React.FC<{ row: CategoryDTO; onSuccess: () => void }> = ({ row, onSuccess }) => {
    const [form] = Form.useForm();

    const poster = useWatch("poster", form);

    const handleSave = async (values: { category_name: string; poster: string }) => {
        await categoryService.adminUpdate({
            ...values,
            id: row.id,
        });
        message.success("保存成功");
        onSuccess();
    };

    const { loading, trigger: onSave } = useAsyncLoading(handleSave, [row.id]);

    return (
        <Form
            wrapperCol={{ span: 24 }}
            form={form}
            labelCol={{ style: { width: "100px" } }}
            initialValues={{
                category_name: row.category_name,
                poster: row.poster,
            }}
            onFinish={onSave}
        >
            <Form.Item label="分类名称" name="category_name">
                <Input placeholder="请输入分类名称" />
            </Form.Item>
            <Form.Item label="海报">
                <Form.Item name="poster">
                    <Input placeholder="请输入海报" />
                </Form.Item>
                <Image src={poster} />
            </Form.Item>
            <Form.Item className="text-center">
                <Button type="primary" htmlType="submit" loading={loading}>
                    保存
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Edit;
