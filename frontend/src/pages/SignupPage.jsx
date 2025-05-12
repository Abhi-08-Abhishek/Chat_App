import React from 'react'
import { useState } from 'react';

import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";
import AuthImagePattern from '../components/AuthImagePattern';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';




const SignUpPage = () => {

  // user is Autherized or not check
  const { signup , isSigningUp} = useAuthStore();

  // form data is store in this veriable when user in provided in input
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",       // initial all value is empty
    password: "",
  });

  // show password
  const [showPassword, setShowPassword] = useState(false);
  
  

  // validate user are providing proper data as per requirement
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async(e) =>{
      e.preventDefault(); //  avoid reload of page

    // store instruction of validateform in success
      const success = validateForm();

    // if success then signp 
      if(success === true){
      await signup(formData)
    }
  }


  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}     // set data first initial value then user input data in fullName
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} //fullName:data
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}        // set data first initial value then user input data in email
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} // email:email data
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}       // set data first initial value then user input data in password
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // password: data
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;




// PRACTICE CODE

/*  // handle submit form data
  const handleSubmit = (e) => {
    e.preventDefault();  // not reload whole page
    // backend part to access Api with axios
    try {
      const isValid = validateForm();
      // if not valid return back
      if(!isValid) return;
  // call Api from backend  fist Api link and second formdata which is user type in input send to backend
      const response = axios.post('http://localhost:3000/api/auth/signup', formData);
      console.log(response);
      toast.success('Account created successfully')
    } catch (e) {
      console.log(e.message);
      toast.error("Something went wrong");
      
    }
    console.log(formData) // user input data is shown on browser console

   // const success = validateForm();   // store validate functionality in success veriable

    //if (success === true) signup(formData);  // check if user are provide proper require data then signup
  };*/