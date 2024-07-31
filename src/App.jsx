import "./app.css";
import { useState, useEffect } from "react";

const EMPTY_FORM = Object.freeze({
    username: "",
    password: "",
});

function App() {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [requestData, setRequestData] = useState(null);

    const handleInput = (event) => {
        setFormData((prevFormData) => ({ ...prevFormData, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/entry/1");
            if (response.ok) {
                let data = await response.json();
                setRequestData(data);
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        console.log(":: requestData: ", requestData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestData]);

    return (
        <>
            <h1 className="title">Basic Authentication</h1>
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                    <div>
                        <label>username</label>
                        <input name="username" type="text" value={formData.username} onChange={(e) => handleInput(e)} />
                    </div>

                    <div>
                        <label>password</label>
                        <input type="password" name="password" value={formData.password} onChange={(e) => handleInput(e)} />
                    </div>

                    <div className="button-container">
                        <button id="register" type="submit">
                            Register
                        </button>
                        or
                        <button id="login" type="submit">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default App;
