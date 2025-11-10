import mongoose from "mongoose";

export const albumSchema = {
  title: {
    in: ["body"],
    isString: true,
    notEmpty: {
      errorMessage: "Title is required and must be a string",
    },
  },
  artist: {
    in: ["body"],
    isString: true,
    notEmpty: {
      errorMessage: "Artist is required and must be a string",
    },
  },
  genre: {
    in: ["body"],
    isArray: true,
    notEmpty: {
      errorMessage: "Genre is required and must be an array",
    },
  },
  year: {
    in: ["body"],
    isInt: {
      options: { min: 1900, max: 2025 },
    },
    notEmpty: {
      errorMessage: "Year is required and must be between 1900 and 2025",
    },
  },
  listened: {
    in: ["body"],
    isBoolean: true,
    optional: true,
    errorMessage: "Listened must be a boolean",
  },
  rating: {
    in: ["body"],
    isInt: {
      options: { min: 0, max: 10 },
    },
    optional: true,
    errorMessage: "Rating must be between 0 and 10",
  },
  review: {
    in: ["body"],
    isString: true,
    optional: true,
    errorMessage: "Review must be a string",
  },
};

export const albumIdSchema = {
  id: {
    in: ["params"],
    custom: {
      options: (value) => mongoose.Types.ObjectId.isValid(value),
      errorMessage: "Album ID 'id' parameter must be a valid ObjectId",
    },
  },
};

export const registerSchema = {
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'name' field is required",
    },
    isString: {
      errorMessage: "'name' field must be a valid name address",
    },
  },
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'email' field is required",
    },
    isEmail: {
      errorMessage: "'email' field must be a valid email address",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'password' field is required",
    },
    isStrongPassword: {
      options: {
        minLength: 8,
        minSymbols: 0,
        minUpperCase: 1,
        minNumbers: 1,
      },
      errorMessage:
        "'password' field must be 8 characters long, contain at least one upper case character and one number",
    },
  },
};

export const loginSchema = {
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'email' field is required",
    },
    isEmail: {
      errorMessage: "'email' field must be a valid email address",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'password' field is required",
    },
    isString: {
      errorMessage: "'password' field must be a valid string",
    },
  },
};
