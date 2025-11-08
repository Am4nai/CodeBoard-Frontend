import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const isDisabled = !emailOrUsername || !password;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!emailOrUsername || !password) { //возможно не понадобится, так как кнопка Continue не работает, если isDisabled=true
      setError("Заполните все поля");
      return;
    }

    try {
      await login(emailOrUsername, password);
      navigate("/");
      
    } catch (err) {
      setError("Invalid credentials");
    }

  }

  return (
    <main className="min-h-screen flex flex-col bg-bg text-text items-center justify-center">
      <div className="w-full max-w-md rounded-2xl px-8 py-16 shadow-3xl">
        <h1 className="text-4xl font-bold mb-4 mr-2 text-center">Login to CodeBoard</h1>
        
        <form className="flex items-center justify-center">
          <h1 className="text-2xl font-bold mb-4 mr-2">Don`t have an account?</h1>
          <button type="button" className="text-2xl font-bold mb-4 text-primary hover:text-primary-hover" onClick={() => {navigate("/register")}}>Sing up</button>
        </form>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center" onChange={() => {setError("")}}>
          <p>Email or username</p>
          <input name="emailOrUsernameInput" type="text" className="bg-surface rounded-sm mb-2 p-2 focus:outline-none focus:bg-surface-focus focus:py-3 transition-all duration-200 ease-in-out" value={emailOrUsername} onChange={(e) => {setEmailOrUsername(e.target.value)}}/>

          <p>Password</p>
          <input name="passwordInput" type="password" className="bg-surface rounded-sm mb-2 p-2 focus:outline-none focus:bg-surface-focus focus:py-3 transition-all duration-200 ease-in-out" value={password} onChange={(e) => {setPassword(e.target.value)}}/>

          {error && <p className="text-error text-sm mt-2">{error}</p>}

          <button type="submit" disabled={isDisabled} className="bg-secondary p-4 mb-2 mt-2 rounded-lg text-text-secondary hover:bg-secondary-hover disabled:bg-not-active disabled:text-text-not-active transition-all duration-200 ease-in-out not-disabled:hover:py-5">
            Continue
          </button>

          <button type="button" className="bg-primary mt-2 rounded-lg hover:bg-primary-hover p-4 transition-all duration-200 ease-in-out hover:py-5 text-text-secondary">Continue with GitHub</button>
        </form>
      </div>


    </main>
  );
};

export default LoginPage;