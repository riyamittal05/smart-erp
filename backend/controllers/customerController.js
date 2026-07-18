const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
    try {
        const { name,email,phone, address} = req.body;

       const existingCustomer = await Customer.findOne({
    email,
    user: req.user.id,
});
if(existingCustomer){
    return res.status(400).json({
        message:"Customer already exists",
    });
}
const customer = await Customer.create({
    user: req.user.id,
    name,
    email,
    phone,
    address,
});
        res.status(201).json({
            message: "Customer created successfully",
            customer,
        });

    } catch (error) {
       

        res.status(500).json({
            message: error.message,
        });
    }
};
//get all customers
const getAllCustomers=async(req,res)=>{
    try{
        const customers=await Customer.find({
    user: req.user.id,
}).sort({
    createdAt: -1,
});
        res.status(200).json(customers);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};

//get single customer
const getCustomerById=async(req,res)=>{
    try{
    const customer = await Customer.findOne({
  _id: req.params.id,
  user: req.user.id,
});
        if(!customer){
            return res.status(404).json({
                message:"Customer not found",
            });
        }
      res.status(200).json(customer);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

//update customers
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
         returnDocument: "after",
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//delete customer
const deleteCustomer=async(req,res)=>{
    try{
     const customer = await Customer.findOneAndDelete({
  _id: req.params.id,
  user: req.user.id,
});
        if(!customer){
            return res.status(404).json({
                message:"Customer not found",
            });
        }
      res.status(200).json({
        message:"Customer deleted successfully",
      });
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

module.exports = { createCustomer,getAllCustomers,getCustomerById,updateCustomer,deleteCustomer};