const Professor = require('../models/Professor');
const Review = require('../models/Review');

exports.getAllProfessors = async (req, res) => {
    try {
        const professors = await Professor.find();
        res.json(professors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProfessor = async (req, res) => {
    try {
        const { name, department } = req.body;
        const professor = new Professor({ name, department });
        await professor.save();
        res.status(201).json(professor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfessorWithReviews = async (req, res) => {
    try {
        const professorId = req.params.id;

        // Fetch professor details
        const professor = await Professor.findById(professorId);
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        // Fetch reviews separately based on professor ID
        const reviews = await Review.find({ professor: professorId }).populate('user', 'username email');

        // Respond with both professor details and reviews
        res.status(200).json({ professor, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};