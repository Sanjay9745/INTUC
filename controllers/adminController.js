const User = require("../models/User");
const Calendar = require("../models/Calendar");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Gallery = require("../models/Galley");
const jwtSecret = process.env.JWT_ADMIN_SECRET;
const fs = require("fs");
const Slogan = require("../models/Slogan");
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Please provide all required fields." });
        }
        const user = await User.findOne({ username });
        if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
        }
        const payload = {
        user: {
            id: user._id,
        },
        };
        jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
        });
    } catch (error) {
        console.error("Error logging in admin:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
//remove this after creating admin
const adminRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Please provide all required fields." });
        }
        const user = await User.findOne({ username });
        if (user) {
        return res.status(400).json({ error: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
        username,
        password: hashedPassword,
        });
        const payload = {
        user: {
            id: newUser._id,
        },
        };
        jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
        });
    } catch (error) {
        console.error("Error registering admin:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getUser = async (req, res) => {
    const { id } = req.params.id;
    try {
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting all users:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }
        await user.remove();
        res.status(200).json({ msg: "User removed" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllOrders = async (req, res) => {
    try {
     const orders = await User.find({}).populate("orders");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error getting all orders:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addGallery = async (req, res) => {
    try {
        const { name, description} = req.body;
        req.body.image = req.file;
        let imageObj = req.body.image;
        // if (!name || !description ) {
        // return res
        //     .status(400)
        //     .json({ error: "Please provide all required fields." });
        // }
        const newGallery = await Gallery.create({
        name,
        description,
        image: `galleryImage/${imageObj.filename}`,
        });
        res.status(201).json(newGallery);
    } catch (error) {
        console.error("Error adding gallery:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const deleteImage = async (req, res) => {
    try {
        const image = await Gallery.findOneAndDelete({_id:req.params.id});
        if (!image) {
        return res.status(404).json({ error: "Image not found" });
        }
        
        res.status(200).json({ msg: "Image removed" });
    } catch (error) {
        console.error("Error deleting image:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const addCalendarEvent = async (req, res) => {
    try {
        const { date } = req.params;
        const { title, description } = req.body;
        if (!date || !title || !description) {
        return res
            .status(400)
            .json({ error: "Please provide all required fields." });
        }

        const calendar = await Calendar.create({
        date,
        title,
        description,
        
        })
        res.status(201).json(calendar);

    } catch (error) {
        console.error("Error adding calendar event:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getCalendarEvents = async (req, res) => {
    try {
        const {date} = req.params;
        const calendar = await Calendar.find({date:date});
        res.status(200).json(calendar);
    } catch (error) {
        console.error("Error getting calendar events:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const deleteCalendarEvent = async (req, res) => {
    try {
        const calendar = await Calendar.findOneAndDelete({_id:req.params.id});
        if (!calendar) {
        return res.status(404).json({ error: "Calendar event not found" });
        }
        
        res.status(200).json({ msg: "Calendar event removed" });
    } catch (error) {
        console.error("Error deleting calendar event:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const AddSlogan = async (req, res) => {
    try {
        const { slogan } = req.body;
        if (!slogan) {
        return res
            .status(400)
            .json({ error: "Please provide all required fields." });
        }
        const newSlogan = await Slogan.create({
        slogan,
        });
        res.status(201).json(newSlogan);
    } catch (error) {
        console.error("Error adding slogan:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getSlogan = async (req, res) => {
    try {
        const slogan = await Slogan.find({});
        res.status(200).json(slogan);
    } catch (error) {
        console.error("Error getting slogan:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const deleteSlogan = async (req, res) => {
    try {
        const slogan = await Slogan.findOneAndDelete({_id:req.params.id});
        if (!slogan) {
        return res.status(404).json({ error: "Slogan not found" });
        }
        
        res.status(200).json({ msg: "Slogan removed" });
    } catch (error) {
        console.error("Error deleting slogan:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = {
    adminLogin,
    adminRegister,
    getAllUsers,
    getUser,
    deleteUser,
    getAllOrders,
    addGallery,
    deleteImage,
    addCalendarEvent,
    getCalendarEvents,
    deleteCalendarEvent,
    AddSlogan,
    getSlogan,
    deleteSlogan
}
