import { NavLink } from "react-router-dom";
import logo from "@/assets/img/logo.png";

const BaseLayout = () => {
    return (
        <section>
            <header className="text-3xl font-bold underline">
                <NavLink to="/">
                    <img src={logo} alt="logo" />
                </NavLink>
                sdfsdf
            </header>
        </section>
    );
};

export default BaseLayout;
