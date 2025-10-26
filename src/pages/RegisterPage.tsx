import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  const isDisabled = !email || !username || !password || !confirmPass;
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
  
      if (password !== confirmPass) {
        setError("Passwords do not match");
        return;
      }

      try {
        await register(username, email, password);
        navigate("/");
        
      } catch (err) {
        setError("Invalid credentials");
      }
  
    }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg text-text">
      <div className="w-full max-w-md rounded-2xl px-8 py-16 shadow-3xl">
        <h1 className="text-3xl font-bold text-center mb-4">Sign up to CodeBoard</h1>

        <form className="flex items-center justify-center">
          <h1 className="text-2xl font-bold mb-4 mr-2">Alrealy have an account?</h1>
          <button type="button" className="text-2xl font-bold mb-4 text-primary hover:text-primary-hover" onClick={() => {navigate("/login")}}>Login</button>
        </form>

        <form onSubmit={handleSubmit} className="flex flex-col justify-center" onChange={() => {setError("")}}>

          <p>Email</p>
          <input name="emailInput" type="text" className="bg-surface rounded-sm mb-2 p-2 focus:outline-none focus:bg-surface-focus focus:py-3 transition-all duration-200 ease-in-out" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
          <p>Username</p>
          <input name="usernameInput" type="text" className="bg-surface rounded-sm mb-2 p-2 focus:outline-none focus:bg-surface-focus focus:py-3 transition-all duration-200 ease-in-out" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
          <p>Password</p>
          <input name="passwordInput" type="password" className="bg-surface rounded-sm mb-2 p-2 focus:outline-none focus:bg-surface-focus focus:py-3 transition-all duration-200 ease-in-out" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
          <p>Confirm password</p>
          <input type="password" className="bg-surface rounded-sm mb-2 p-2 focus:outline-none focus:bg-surface-focus focus:py-3 transition-all duration-200 ease-in-out" value={confirmPass} onChange={(e) => {setConfirmPass(e.target.value)}}/>

          {error && <p className="text-error text-sm mt-2">{error}</p>}

          <button 
            type="submit"
            disabled={isDisabled}
            className="bg-secondary p-4 mb-2 mt-2 rounded-lg hover:bg-secondary-hover disabled:bg-not-active disabled:text-text-not-active transition-all duration-200 ease-in-out not-disabled:hover:py-5"
          >
            Continue
          </button>

          <button
            type="button"
            className="bg-primary mt-2 rounded-lg hover:bg-primary-hover p-4 transition-all duration-200 ease-in-out hover:py-5"
          >
            Continue with GitHub
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;