import Corporate from '../models/Corporate.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ HELPER: Send email function
const sendApprovalEmail = async (corporate) => {
  // Implement email sending logic here
  console.log(`Approval email sent to ${corporate.contactPersonEmail}`);
};

const sendRejectionEmail = async (corporate, reason) => {
  // Implement rejection email logic here
  console.log(`Rejection email sent to ${corporate.contactPersonEmail}`);
};

/* =====================================================
   CORPORATE REGISTER
===================================================== */
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

    // ✅ Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // ✅ Check if email already exists
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

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create corporate
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
      isApproved: false,
      registeredAt: new Date()
    });

    // ✅ Remove password from response
    const corporateData = corporate.toObject();
    delete corporateData.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful. Awaiting admin approval.',
      data: corporateData
    });

  } catch (error) {
    console.error('❌ REGISTER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/* =====================================================
   CORPORATE LOGIN (APPROVAL CHECK)
===================================================== */
export const loginCorporate = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    console.log('🔍 Login attempt for email:', email);

    // ✅ Find corporate by email (check both company and contact email)
    const corporate = await Corporate.findOne({
      $or: [
        { companyEmail: email.toLowerCase() },
        { contactPersonEmail: email.toLowerCase() }
      ]
    }).select('+password'); // IMPORTANT: Include password field

    if (!corporate) {
      console.log('❌ No corporate found with email:', email);
      return res.status(404).json({
        success: false,
        message: 'No corporate account found with this email'
      });
    }

    // ✅ Verify password
    const isPasswordValid = await bcrypt.compare(password, corporate.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Password verified for:', corporate.companyName);

    // ✅ CHECK ADMIN APPROVAL STATUS
    console.log('🔍 Approval check:', {
      status: corporate.status,
      isApproved: corporate.isApproved
    });

    if (corporate.status !== 'approved' || corporate.isApproved !== true) {
      console.log('❌ Not approved:', {
        status: corporate.status,
        isApproved: corporate.isApproved
      });

      return res.status(403).json({
        success: false,
        message: corporate.status === 'rejected'
          ? 'Your corporate account has been rejected. Please contact support.'
          : 'Your corporate account is under verification. Please wait for admin approval.',
        status: corporate.status,
        isApproved: corporate.isApproved
      });
    }

    console.log('✅ Account approved for:', corporate.companyName);

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: corporate._id,
        email: corporate.companyEmail,
        type: 'corporate',
        companyName: corporate.companyName
      },
      process.env.JWT_SECRET || 'corporate-secret-key-2024',
      { expiresIn: '30d' }
    );

    // ✅ Update last login
    corporate.lastLogin = new Date();
    await corporate.save();

    // ✅ Remove password from response
    const corporateData = corporate.toObject();
    delete corporateData.password;

    console.log('✅ Login successful for:', corporate.companyName);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: corporateData,
      corporate: corporateData // Also include 'corporate' field for consistency
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* =====================================================
   GET ALL CORPORATES (ADMIN)
===================================================== */
export const getAllCorporates = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    let query = {};

    // ✅ Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // ✅ Search filter
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { companyEmail: { $regex: search, $options: 'i' } },
        { contactPersonName: { $regex: search, $options: 'i' } },
        { contactPersonEmail: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // ✅ Get corporates
    const corporates = await Corporate.find(query)
      .select('-password')
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const total = await Corporate.countDocuments(query);

    res.json({
      success: true,
      data: corporates,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize)
    });

  } catch (error) {
    console.error('❌ GET ALL CORPORATES ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching corporates'
    });
  }
};

/* =====================================================
   GET CORPORATE BY ID (ADMIN PANEL)
===================================================== */
export const getCorporateById = async (req, res) => {
  try {
    const corporate = await Corporate.findById(req.params.id).select('-password');

    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate not found'
      });
    }

    res.json({
      success: true,
      data: corporate
    });

  } catch (error) {
    console.error('❌ GET CORPORATE BY ID ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching corporate details'
    });
  }
};

/* =====================================================
   ADMIN - APPROVE CORPORATE
===================================================== */
export const approveCorporate = async (req, res) => {
  try {
    const { verificationNotes } = req.body;

    const corporate = await Corporate.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        isApproved: true,
        verificationNotes: verificationNotes || 'Approved by admin',
        verificationDate: new Date()
      },
      { new: true }
    ).select('-password');

    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate not found'
      });
    }

    // ✅ Send approval email
    await sendApprovalEmail(corporate);

    console.log('✅ CORPORATE APPROVED:', {
      id: corporate._id,
      companyName: corporate.companyName,
      status: corporate.status,
      isApproved: corporate.isApproved
    });

    res.json({
      success: true,
      message: 'Corporate approved successfully',
      data: corporate
    });

  } catch (error) {
    console.error('❌ APPROVE CORPORATE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving corporate'
    });
  }
};

/* =====================================================
   ADMIN - REJECT CORPORATE
===================================================== */
export const rejectCorporate = async (req, res) => {
  try {
    const { verificationNotes } = req.body;

    if (!verificationNotes || verificationNotes.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const corporate = await Corporate.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        isApproved: false,
        verificationNotes,
        verificationDate: new Date()
      },
      { new: true }
    ).select('-password');

    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate not found'
      });
    }

    // ✅ Send rejection email
    await sendRejectionEmail(corporate, verificationNotes);

    res.json({
      success: true,
      message: 'Corporate rejected successfully',
      data: corporate
    });

  } catch (error) {
    console.error('❌ REJECT CORPORATE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting corporate'
    });
  }
};

/* =====================================================
   UPDATE CORPORATE STATUS (GENERAL)
===================================================== */
export const updateCorporateStatus = async (req, res) => {
  try {
    const { status, verificationNotes } = req.body;

    const updateData = {
      status,
      verificationNotes,
      verificationDate: new Date()
    };

    // ✅ Set isApproved based on status
    if (status === 'approved') {
      updateData.isApproved = true;
    } else if (status === 'rejected' || status === 'pending') {
      updateData.isApproved = false;
    }

    const corporate = await Corporate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: 'Corporate not found'
      });
    }

    // ✅ Send email based on status
    if (status === 'approved') {
      await sendApprovalEmail(corporate);
    } else if (status === 'rejected') {
      await sendRejectionEmail(corporate, verificationNotes);
    }

    res.json({
      success: true,
      message: `Corporate status updated to ${status}`,
      data: corporate
    });

  } catch (error) {
    console.error('❌ UPDATE STATUS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating status'
    });
  }
};

/* =====================================================
   DELETE CORPORATE
===================================================== */
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

    res.json({
      success: true,
      message: 'Corporate deleted successfully'
    });

  } catch (error) {
    console.error('❌ DELETE CORPORATE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting corporate'
    });
  }
};

/* =====================================================
   GET CORPORATE STATS (ADMIN DASHBOARD)
===================================================== */
export const getCorporateStats = async (req, res) => {
  try {
    const total = await Corporate.countDocuments();
    const pending = await Corporate.countDocuments({ status: 'pending' });
    const approved = await Corporate.countDocuments({ status: 'approved' });
    const rejected = await Corporate.countDocuments({ status: 'rejected' });

    // ✅ Calculate total employees and cabs
    const approvedCorporates = await Corporate.find({ status: 'approved' });
    
    const totalEmployees = approvedCorporates.reduce((sum, corp) => 
      sum + (corp.vehicleRequirements?.employeesCount || 0), 0
    );
    
    const totalCabs = approvedCorporates.reduce((sum, corp) => 
      sum + (corp.vehicleRequirements?.numberOfCabs || 0), 0
    );

    // ✅ Monthly travel estimate
    const monthlyTravel = approvedCorporates.reduce((sum, corp) => 
      sum + (corp.vehicleRequirements?.monthlyTravelEstimate || 0), 0
    );

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        active: approved, // Active = Approved
        totalEmployees,
        totalCabs,
        monthlyTravel
      }
    });

  } catch (error) {
    console.error('❌ GET STATS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats'
    });
  }
};