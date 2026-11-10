
import Destination from "../models/Destination.js";

// ======================================
// CHALLENGE 01: ADD DESTINATIONS
// ======================================

// 1. Add one destination using create()

export const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      message: "Destination added successfully",
      data: destination
    });

  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message: error.code === 11000
        ? "Destination name already exists"
        : error.message
    });
  }
};


// 2. Add multiple destinations using insertMany()

export const insertMultipleDestinations = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of destinations"
      });
    }

    const destinations = await Destination.insertMany(req.body);

    res.status(201).json({
      success: true,
      message: "Multiple destinations added successfully",
      count: destinations.length,
      data: destinations
    });

  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================
// CHALLENGE 02: RETRIEVE DESTINATIONS
// ======================================

// 3. Retrieve all destinations using find()

export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// 4. Retrieve destination by ID using findById()

export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found"
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });

  } catch (error) {
    res.status(error.name === "CastError" ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};


// 5. Retrieve destination by name using findOne()

export const getDestinationByName = async (req, res) => {
  try {
    const destination = await Destination.findOne({
      name: req.params.name
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found"
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================
// CHALLENGE 03: UPDATE DESTINATIONS
// ======================================

// 6. Update by ID using findByIdAndUpdate()

export const updateDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      data: destination
    });

  } catch (error) {
    res.status(
      error.name === "CastError" ? 400 :
      error.code === 11000 ? 409 : 400
    ).json({
      success: false,
      message: error.message
    });
  }
};


// 7. Update by name using findOneAndUpdate()

export const updateDestinationByName = async (req, res) => {
  try {
    const destination = await Destination.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      data: destination
    });

  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================
// CHALLENGE 04: SMART DESTINATION DISCOVERY
// ======================================

// 8. Filter, sort and paginate destinations

export const discoverDestinations = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy = "price",
      order = "asc",
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Category filtering
    if (category) {
      filter.category = category;
    }

    // Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }

      if (
        Object.values(filter.price).some(value => !Number.isFinite(value)) ||
        (minPrice !== undefined && Number(minPrice) < 0) ||
        (maxPrice !== undefined && Number(maxPrice) < 0) ||
        (minPrice !== undefined && maxPrice !== undefined &&
          Number(minPrice) > Number(maxPrice))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid price range"
        });
      }
    }

    // Allow only supported sorting fields
    const allowedSortFields = ["price", "rating", "name"];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort field. Use price, rating or name"
      });
    }

    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        success: false,
        message: "Order must be asc or desc"
      });
    }

    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      !Number.isInteger(pageLimit) ||
      pageNumber < 1 ||
      pageLimit < 1 ||
      pageLimit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit value"
      });
    }

    const sortOrder = order === "asc" ? 1 : -1;

    // Retrieve filtered and sorted destinations
    const destinations = await Destination.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);

    // Count matching documents
    const total = await Destination.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / pageLimit),
      data: destinations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// 9. Retrieve unique categories using distinct()

export const getDestinationCategories = async (req, res) => {
  try {
    const categories = await Destination.distinct("category");

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// 10. Count destinations using countDocuments()

export const countDestinations = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const total = await Destination.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================
// CHALLENGE 05: DESTINATION CLEANUP
// ======================================

// 11. Delete by ID using findByIdAndDelete()

export const deleteDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(
      req.params.id
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
      data: destination
    });

  } catch (error) {
    res.status(error.name === "CastError" ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};


// 12. Delete by name using findOneAndDelete()

export const deleteDestinationByName = async (req, res) => {
  try {
    const destination = await Destination.findOneAndDelete({
      name: req.params.name
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
      data: destination
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// 13. Delete multiple destinations using deleteMany()

export const deleteMultipleDestinations = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Please provide a category to delete"
      });
    }

    const result = await Destination.deleteMany({
      category: category
    });

    res.status(200).json({
      success: true,
      message: "Matching destinations deleted successfully",
      deletedCount: result.deletedCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
