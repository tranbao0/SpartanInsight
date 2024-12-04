exports.createReview = async (req, res) => {
    try {
      const { professorId, courseId, rating, comment } = req.body;
  
      console.log("Request Body:", req.body); // Log incoming request data
  
      // Ensure either professorId or courseId is provided
      if (!professorId && !courseId) {
        console.log("Validation Error: Neither professorId nor courseId provided.");
        return res.status(400).json({ message: 'Professor ID or Course ID is required.' });
      }
  
      if (professorId && courseId) {
        console.log("Validation Error: Both professorId and courseId provided.");
        return res.status(400).json({ message: 'Provide either a Professor ID or a Course ID, not both.' });
      }
  
      // Validate professor or course existence
      if (professorId) {
        const professor = await Professor.findById(professorId);
        console.log("Professor Found:", professor);
        if (!professor) {
          console.log("Error: Professor not found.");
          return res.status(404).json({ message: 'Professor not found.' });
        }
      }
  
      if (courseId) {
        const course = await Course.findById(courseId);
        console.log("Course Found:", course);
        if (!course) {
          console.log("Error: Course not found.");
          return res.status(404).json({ message: 'Course not found.' });
        }
      }
  
      // Create the review
      const review = new Review({
        professor: professorId || null,
        course: courseId || null,
        user: req.user._id, // Assumes `protect` middleware sets `req.user`
        rating,
        comment,
      });
  
      await review.save();
      console.log("Review Created Successfully:", review);
  
      res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
      console.error('Error creating review:', error); // Log the exact error
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  