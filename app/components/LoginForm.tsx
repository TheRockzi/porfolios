'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiUser, FiLock, FiAlertCircle, FiLoader, FiUserPlus, FiMail, FiArrowLeft } from 'react-icons/fi';

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isRegistering) {
      // Validate registration
      if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Simulate registration request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setIsRegistering(false);
      setFormData({ ...formData, confirmPassword: '', email: '' });
      return;
    }

    // Login logic
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    // Simulate login request
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.username === 'admin' && formData.password === 'admin') {
      onLogin({ username: formData.username, password: formData.password });
    } else {
      setError('Invalid credentials');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setFormData({
      username: '',
      password: '',
      email: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZjAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff0000]/10 to-transparent"></div>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex flex-col items-center gap-2 mb-8"
          >
            <div className="relative">
              <FiShield className="text-[#ff0000] text-4xl" />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 text-[#ff0000] text-4xl blur-md"
              >
                <FiShield />
              </motion.div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                KaliumOSINT
              </h1>
              <p className="text-[#00e5ff] text-sm mt-1">ADVANCED OSINT PLATFORM</p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2"
              >
                <FiAlertCircle className="text-red-500" />
                <span className="text-red-500 text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegistering ? 'register' : 'login'}
                initial={{ opacity: 0, x: isRegistering ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRegistering ? -20 : 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {isRegistering && (
                  <div className="relative group">
                    <FiMail className="absolute left-3 top-3 text-gray-500 transition-colors group-focus-within:text-[#ff0000]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white
                               placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40 transition-all
                               hover:border-white/20"
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="relative group">
                  <FiUser className="absolute left-3 top-3 text-gray-500 transition-colors group-focus-within:text-[#ff0000]" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white
                             placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40 transition-all
                             hover:border-white/20"
                    disabled={isLoading}
                  />
                </div>

                <div className="relative group">
                  <FiLock className="absolute left-3 top-3 text-gray-500 transition-colors group-focus-within:text-[#ff0000]" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white
                             placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40 transition-all
                             hover:border-white/20"
                    disabled={isLoading}
                  />
                </div>

                {isRegistering && (
                  <div className="relative group">
                    <FiLock className="absolute left-3 top-3 text-gray-500 transition-colors group-focus-within:text-[#ff0000]" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white
                               placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40 transition-all
                               hover:border-white/20"
                      disabled={isLoading}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {!isRegistering && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                      disabled={isLoading}
                    />
                    <div className="w-4 h-4 border border-white/10 rounded transition-colors
                                  peer-checked:bg-[#ff0000] peer-checked:border-[#ff0000]
                                  group-hover:border-white/20"></div>
                    <FiUser className="absolute inset-0 m-auto text-white scale-0 transition-transform
                                     peer-checked:scale-75" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-[#00e5ff] hover:text-[#00e5ff]/80 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-[#ff0000] to-[#ff0000]/80 text-white py-2 rounded-lg
                       hover:from-[#ff0000]/90 hover:to-[#ff0000]/70 transition-all duration-300 font-medium
                       shadow-lg shadow-[#ff0000]/20 disabled:opacity-50 disabled:cursor-not-allowed
                       overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <FiLoader className="animate-spin text-xl" />
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {isRegistering ? 'Create Account' : 'Login'}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="relative w-full bg-black/40 text-white py-2 rounded-lg
                       hover:bg-black/60 transition-all duration-300 font-medium
                       border border-white/10 hover:border-white/20
                       flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <>
                  <FiArrowLeft className="text-[#00e5ff]" />
                  <span>Back to Login</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="text-[#00e5ff]" />
                  <span>Register New Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Authorized Access Only • All Activities Are Monitored
        </p>
      </motion.div>
    </div>
  );
}