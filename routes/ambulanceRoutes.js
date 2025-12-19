import express from "express";
import multer from "multer";
import {
  registerAmbulance,
  loginAmbulance,
  getAllAmbulances,
  approveAmbulance,
  rejectAmbulance,
} from "../controllers/ambulanceController.js";

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

router.post("/register", uploadFields, registerAmbulance);
router.post("/login", loginAmbulance);

router.get("/", getAllAmbulances);
router.put("/approve/:id", approveAmbulance);
router.put("/reject/:id", rejectAmbulance);

export default router;
