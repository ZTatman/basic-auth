import './App.css';

function App() {
    return (
        <>
            <h1 className="title">Basic Authentication</h1>
            <div className="form-container">
                <form className="form">
                    <div>
                        <label>username</label>
                        <input name="username" type="text" />
                    </div>

                    <div>
                        <label>password</label>
                        <input type="password" name="password" />
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
