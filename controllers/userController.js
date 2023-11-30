const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWT_SECRET;
const register = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const {
      name,
      email,
      password,
      phoneNumber,
      whatsappNumber,
      age,
      date_of_birth,
      block,
      constituency,
      union, // Change "Union" to "union" here
      addaar,
      pan_card,
    } = req.body;

    // Step 2: Validate User Input
    if (!name || !email || !password || !phoneNumber || !whatsappNumber || !age || !date_of_birth || !block || !constituency || !union ) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Validate password strength (add your own criteria)
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Step 3: Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      whatsappNumber,
      age,
      date_of_birth,
      block,
      constituency,
      union,
      addaar,
      pan_card,
    });
    const savedUser = await newUser.save();

    // Step 5: Generate JWT
    const token = jwt.sign({ userId: savedUser._id }, jwtSecret, {
      expiresIn: "1h",
    });

    // Step 6: Send Response
    res.json({
      token,
      user: { id: savedUser._id, name: savedUser.name },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email, password } = req.body;

    // Step 2: Validate User Input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email });

    // Step 4: Verify User and Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Step 5: Generate JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    // Step 6: Send Response
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const protected = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ message: "You are authorized" });
    } else {
      res.status(401).json({ message: "You are not authorized" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const details = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const update = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      whatsappNumber,
      age,
      date_of_birth,
      block,
      constituency,
      union, // Change "Union" to "union" if needed
      addaar,
      pan_card,
    } = req.body;

    const user = await User.findById(req.user.userId);

    // If fields exist, update them
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update additional fields
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (whatsappNumber) {
      user.whatsappNumber = whatsappNumber;
    }
    if (age) {
      user.age = age;
    }
    if (date_of_birth) {
      user.date_of_birth = date_of_birth;
    }
    if (block) {
      user.block = block;
    }
    if (constituency) {
      user.constituency = constituency;
    }
    if (union) {
      user.union = union;
    }
    if (addaar) {
      user.addaar = addaar;
    }
    if (pan_card) {
      user.pan_card = pan_card;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete(req.user.userId);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  register,
  login,
  protected,
  details,
  update,
  deleteUser,
};
