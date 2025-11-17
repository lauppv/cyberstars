import React, { useState } from "react";

function AuthPage({ goHome }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 p-3 rounded focus:outline-none focus:border-green-600"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:border-green-600"
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:border-green-600"
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-green-600 font-semibold ml-2 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        <button
          className="mt-6 w-full py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
          onClick={goHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
export default AuthPage;