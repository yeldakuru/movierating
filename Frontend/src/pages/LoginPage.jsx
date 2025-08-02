import { useState, useEffect } from "react";
import { useUserStore } from "../store/useUserStore.js";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [rememberEmail, setRememberEmail] = useState(false); // ✅ checkbox state

    const { login, isLoggingIn } = useUserStore();
    const navigate = useNavigate();

    // ✅ On component mount, check localStorage for saved email
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberEmail(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);

            // ✅ Store email if "remember" is checked, otherwise clear it
            if (rememberEmail) {
                localStorage.setItem("rememberedEmail", formData.email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            navigate("/");
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="w-full max-w-md p-8 bg-base-100 rounded-xl shadow-xl">
                {/* Logo + Heading */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                        <p className="text-base-content/60">Sign in to your account</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Email</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                            <input
                                type="email"
                                className="input input-bordered w-full pl-10"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input input-bordered w-full pl-10 pr-10"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5 text-base-content/40" />
                                ) : (
                                    <Eye className="w-5 h-5 text-base-content/40" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Email Checkbox */}
                    <div className="form-control">
                        <label className="cursor-pointer label gap-3">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={rememberEmail}
                                onChange={() => setRememberEmail(!rememberEmail)}
                            />
                            <span className="label-text">Remember my email</span>
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-base-content/60">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="link link-primary">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;