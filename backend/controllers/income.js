const IncomeSchema= require("../models/IncomeModel")


exports.addIncome = async (req, res) => {
    const {title, amount, category, description, date}  = req.body; //This line is using destructuring to extract the title, amount, category, description, and date properties from the req.body object. These properties are expected to be included in the request body sent by the client.

    const income = IncomeSchema({   //This line is creating a new instance of the IncomeSchema model, using the         properties extracted from the req.body object. This instance will represent a new income record to be added to the database.
        title,     
        amount,
        category,
        description,
        date
    })

    try {
        //validations
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await income.save()
        res.status(200).json({message: 'Income has been successfully added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(income)
}

exports.getIncomes = async (req, res) =>{
    try {
        const incomes = await IncomeSchema.find().sort({createdAt: -1})  //".sort({createdAt: -1})" method is used to sort the incomes in descending order of creation time so that the latest income appears first.
        return res.status(200).json(incomes)
    } catch (error) {
        return res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteIncome = async (req, res) =>{
    const {id} = req.params;    //the "req.params" object contains a property for each parameter in the URL. In this case, the parameter is named "id" (which is typically used to specify a unique identifier for a resource). The curly braces and "id" inside of them are part of JavaScript's destructuring syntax, which allows you to extract a specific property from an object and assign it to a new variable with the same name.
    IncomeSchema.findByIdAndDelete(id)
        .then((income) =>{
            res.status(200).json({message: 'Income Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}