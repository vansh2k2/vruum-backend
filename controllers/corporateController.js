// controllers/corporateController.js
import Corporate from '../models/Corporate.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ Corporate Register
export const registerCorporate = async (req, res) => {
    try {
        const {
            companyName,
            companyEmail,
            companyPhone,
            gstNumber,
            panNumber,
            companyAddress,
            city,
            state,
            pincode,
            contactPersonName,
            contactPersonEmail,
            contactPersonPhone,
            password,
            confirmPassword,
            vehicleRequirements
        } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Check if already exists
        const existing = await Corporate.findOne({
            $or: [
                { companyEmail },
                { contactPersonEmail }
            ]
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create corporate
        const corporate = await Corporate.create({
            companyName,
            companyEmail,
            companyPhone,
            gstNumber,
            panNumber,
            companyAddress,
            city,
            state,
            pincode,
            contactPersonName,
            contactPersonEmail,
            contactPersonPhone,
            password: hashedPassword,
            vehicleRequirements,
            status: 'pending',
            registeredAt: new Date()
        });

        // Remove password
        const corporateData = corporate.toObject();
        delete corporateData.password;

        res.status(201).json({
            success: true,
            message: 'Registration successful. Awaiting admin approval.',
            data: corporateData
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ✅ Get All Corporates (Admin)
export const getAllCorporates = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        
        let query = {};
        
        // Status filter
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // Search
        if (search) {
            query.$or = [
                { companyName: { $regex: search, $options: 'i' } },
                { companyEmail: { $regex: search, $options: 'i' } },
                { contactPersonName: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }
        
        const corporates = await Corporate.find(query)
            .select('-password')
            .sort({ registeredAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await Corporate.countDocuments(query);
        
        res.status(200).json({
            success: true,
            data: corporates,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
        
    } catch (error) {
        console.error('Get corporates error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ✅ Get Single Corporate (Admin)
export const getCorporateById = async (req, res) => {
    try {
        const corporate = await Corporate.findById(req.params.id).select('-password');
        
        if (!corporate) {
            return res.status(404).json({
                success: false,
                message: 'Corporate not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: corporate
        });
        
    } catch (error) {
        console.error('Get corporate error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ✅ Update Corporate Status (Approve/Reject)
export const updateStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        const corporate = await Corporate.findById(req.params.id);
        
        if (!corporate) {
            return res.status(404).json({
                success: false,
                message: 'Corporate not found'
            });
        }
        
        corporate.status = status;
        corporate.verificationNotes = notes;
        corporate.verificationDate = new Date();
        
        await corporate.save();
        
        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`,
            data: corporate
        });
        
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ✅ Delete Corporate
export const deleteCorporate = async (req, res) => {
    try {
        const corporate = await Corporate.findById(req.params.id);
        
        if (!corporate) {
            return res.status(404).json({
                success: false,
                message: 'Corporate not found'
            });
        }
        
        await corporate.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Corporate deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ✅ Get Stats (Admin Dashboard)
export const getStats = async (req, res) => {
    try {
        const total = await Corporate.countDocuments();
        const pending = await Corporate.countDocuments({ status: 'pending' });
        const approved = await Corporate.countDocuments({ status: 'approved' });
        const rejected = await Corporate.countDocuments({ status: 'rejected' });
        
        res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                approved,
                rejected
            }
        });
        
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};