const Category = require("../models/category");


//create tag handler
exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create entry in DB
    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);
    //return response
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      message: "All tags returned successfully",
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;
    //get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate("course")
      .exec();
    //validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }

    if (!selectedCategory.course || selectedCategory.course.length === 0) {
      console.log("No courses found for this selected category");
      return res.status(404).json({
        success: false,
        message: "No courses found for selected category",
      });
    }

    const selectedcourse = selectedCategory.course;


    //get courses for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("course")
      .exec();

      let differentCourses = [];

      for(const category of differentCategories){
        differentCourses.push(...category.course)
      }


    //get top selling courses

    const allCategories = await Category.find().populate("course");
    const allCourses = allCategories.flatMap((category) => category.course);

    const mostsellingCourse = allCourses
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 10);


    //return response
    return res.status(200).json({
      success: true,
      data: {
        selectedcourse :selectedcourse,
        differentCourses : differentCourses,
        mostsellingCourse : mostsellingCourse
      
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
