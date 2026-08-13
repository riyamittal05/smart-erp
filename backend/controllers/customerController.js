const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const existingCustomer = await Customer.findOne({
            email,
            business: req.user.businessId,
        });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already exists" });
        }
        const customer = await Customer.create({
            business: req.user.businessId,
            name, email, phone, address,
        });
        res.status(201).json({
            message: "Customer created successfully",
            customer,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get all customers (paginated)
const getAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const customers = await Customer.find({ business: req.user.businessId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Customer.countDocuments({ business: req.user.businessId });

        res.status(200).json({
            customers,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCustomers: total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            business: req.user.businessId,
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, business: req.user.businessId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({
            message: "Customer updated successfully",
            customer,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({
            _id: req.params.id,
            business: req.user.businessId,
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };