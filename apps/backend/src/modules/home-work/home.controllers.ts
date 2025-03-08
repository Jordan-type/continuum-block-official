import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

import  { cloudinary } from "../../config/cloudinary.config";	
import Course from "./model";