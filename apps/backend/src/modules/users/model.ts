

import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    imgUrl?: string;
    password: string;
    avatar: {
      public_id: string;
      url: string;
    };
    role: string;
    isVerified: boolean;
    verificationCode: string;
    recoveryCode?: string | null;
    rememberMe: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
  }


const userSchema: Schema<IUser> = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: [true, "Please enter your name"],},
    email: { type: String, required: [true, "Please enter your email"], 
        validate: { validator: function (value: string) {
            return emailRegexPattern.test(value);
          },
          message: "please enter a valid email",
        }, unique: true,
      },
      imgUrl: { type: String },
      password: { type: String, minlength: [6, "Password must be at least 6 characters"], select: false,},
      avatar: {public_id: String,url: String,},
      role: { type: String, default: "user",},
      isVerified: { type: Boolean, default: false,},
      verificationCode: { type: String, default: () => nanoid() },
      courses: [{courseId: String,},],
      recoveryCode: { type: String },
      rememberMe: { type: Boolean, default: false },
    },
    { timestamps: true })