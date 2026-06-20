import express from 'express';
import Complaint from '../models/Complaint.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Apply protection middleware to all complaint endpoints
router.use(protect);

// @route   POST /api/complaints
// @desc    Submit a new complaint (Student only)
router.post('/', async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can file complaints' });
  }

  const { title, category, description, location } = req.body;

  try {
    const complaint = await Complaint.create({
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      createdBy: req.user.id,
      createdByName: req.user.name,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error filing complaint', error: error.message });
  }
});

// @route   GET /api/complaints
// @desc    Get complaints list (filtered for student, all for admin)
router.get('/', async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      complaints = await Complaint.find().sort({ createdDate: -1 });
    } else {
      complaints = await Complaint.find({ createdBy: req.user.id }).sort({ createdDate: -1 });
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving complaints', error: error.message });
  }
});

// @route   PUT /api/complaints/:id
// @desc    Update complaint details (Owner only, only if Pending)
router.put('/:id', async (req, res) => {
  const { title, category, description, location } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check ownership
    if (complaint.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You do not own this complaint' });
    }

    // Check status
    if (complaint.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot edit complaint details after review has started' });
    }

    // Update
    complaint.title = title ? title.trim() : complaint.title;
    complaint.category = category || complaint.category;
    complaint.description = description ? description.trim() : complaint.description;
    complaint.location = location ? location.trim() : complaint.location;

    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating complaint', error: error.message });
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint (Owner only, only if Pending)
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check ownership
    if (complaint.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You do not own this complaint' });
    }

    // Check status
    if (complaint.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete complaint after review has started' });
    }

    await Complaint.deleteOne({ _id: req.params.id });
    res.json({ message: 'Complaint removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting complaint', error: error.message });
  }
});

// @route   PATCH /api/complaints/:id/status
// @desc    Update complaint status & resolution (Admin only)
router.patch('/:id/status', adminOnly, async (req, res) => {
  const { status, resolutionDetails } = req.body;

  if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolutionDetails = resolutionDetails || 'Resolved by Administrator.';
      complaint.resolvedDate = new Date();
    } else {
      // Clear resolution if reverting status
      complaint.resolutionDetails = undefined;
      complaint.resolvedDate = undefined;
    }

    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating complaint status', error: error.message });
  }
});

export default router;
