const Course = require('../models/Course');
const Review = require('../models/Review');  // Import the Review model


exports.createCourse = async (req, res) => {
    try {
        const { name } = req.body;
        const course = new Course({ name });
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCourseWithReviews = async (req, res) => {
    try {
        const courseId = req.params.id;

        // Fetch course details
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch reviews separately based on course ID
        const reviews = await Review.find({ course: courseId }).populate('user', 'username email');

        // Respond with both course details and reviews
        res.status(200).json({ course, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};