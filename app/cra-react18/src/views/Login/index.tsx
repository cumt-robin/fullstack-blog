import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Hashes from "jshashes";
import { validatorService } from "@fullstack-blog/services";
import { REQUIRED_VALIDATOR_BLUR } from "@fullstack-blog/utils";
import { format } from "@fullstack-blog/utils";
import BaseLayout from "@/components/BaseLayout";
import { useAsyncLoading } from "@/hooks/async";
import { useAppDispatch } from "@/store/hooks";
import { dispatchLogin } from "@/store/slices/auth";

const Wrapper = styled.section`
    position: relative;
    > h2 {
        text-align: center;
        font-size: 1.5em;
    }
`;

const verifyimgHeight = "30px";

const StyledForm = styled(Form)`
    width: 400px;
    max-width: 86%;
    margin: 0 auto;
`;

const CodeInput = styled(Input)`
    padding-right: 90px;

    .verify-code {
        position: absolute;
        right: 0;
        top: 0;
        height: ${verifyimgHeight};
        > svg {
            width: 90px;
            height: ${verifyimgHeight};
            line-height: ${verifyimgHeight};
        }
    }
`;

export const Component: React.FC = () => {
    const [svgHtml, setSvgHtml] = useState("");

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [form] = useForm();

    const rules = {
        userName: [REQUIRED_VALIDATOR_BLUR],
        password: [REQUIRED_VALIDATOR_BLUR],
        captcha: [REQUIRED_VALIDATOR_BLUR],
    };

    const getVerifyCode = async () => {
        const res = await validatorService.imgCode();
        setSvgHtml(res.data);
    };

    useEffect(() => {
        getVerifyCode();
    }, []);

    const handleLogin = async () => {
        await form.validateFields();
        const sha256 = new Hashes.SHA256();
        const params = {
            ...form.getFieldsValue(),
            password: sha256.hex(form.getFieldValue("password")),
        };
        try {
            const result = await dispatch(dispatchLogin(params)).unwrap();
            message.success(`登录成功，上次登录时间：${format(result.last_login_time)}`);
            navigate("/backend");
        } catch (error) {
            getVerifyCode();
        }
    };

    const { loading, trigger: onClickLogin } = useAsyncLoading(handleLogin);

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClickLogin();
        }
    };

    return (
        <BaseLayout>
            <Wrapper>
                <h2>登录后台</h2>
                <StyledForm form={form}>
                    <Form.Item name="userName" rules={rules.userName}>
                        <Input
                            placeholder="用户名"
                            prefix={<UserOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
                            onKeyUp={handleKeyUp}
                        />
                    </Form.Item>
                    <Form.Item name="password" rules={rules.password}>
                        <Input
                            type="password"
                            placeholder="密码"
                            prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
                            onKeyUp={handleKeyUp}
                        />
                    </Form.Item>
                    <Form.Item name="captcha" rules={rules.captcha}>
                        <CodeInput
                            placeholder="验证码"
                            prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
                            suffix={<div className="verify-code" dangerouslySetInnerHTML={{ __html: svgHtml }} />}
                            onKeyUp={handleKeyUp}
                        />
                    </Form.Item>
                    <Form.Item className="text-center">
                        <Button type="primary" loading={loading} onClick={onClickLogin}>
                            登录
                        </Button>
                    </Form.Item>
                </StyledForm>
            </Wrapper>
        </BaseLayout>
    );
};
