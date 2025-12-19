import express from "express";
import multer from "multer";
import {
  registerHearse,
  loginHearse,
  getAllHearse,
  approveHearse,
  rejectHearse,
} from "../controllers/hearseController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const uploadFields = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "vehiclePicture", maxCount: 1 },
  { name: "aadharFront", maxCount: 1 },
  { name: "aadharBack", maxCount: 1 },
  { name: "dlFront", maxCount: 1 },
  { name: "dlBack", maxCount: 1 },
  { name: "policeClearance", maxCount: 1 },
  { name: "rcCertificate", maxCount: 1 },
  { name: "fitnessCertificate", maxCount: 1 },
  { name: "pollutionCertificate", maxCount: 1 },
  { name: "insuranceCertificate", maxCount: 1 },
]);

// REGISTER
router.post("/register", uploadFields, registerHearse);

// LOGIN
router.post("/login", loginHearse);

// ADMIN
router.get("/", getAllHearse);
router.put("/approve/:id", approveHearse);
router.put("/reject/:id", rejectHearse);

export default router;
