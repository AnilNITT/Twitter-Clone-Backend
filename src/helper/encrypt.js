var bcrypt = require('bcryptjs');

// convert password into HashPasaword format
const hashPassword = (password)=>{
    const saltRounds = 10;
    const salt =  bcrypt.genSaltSync(saltRounds);

    // now we set user password to hashed password
    const data= bcrypt.hashSync(password, salt);

    return data

}


// comapre password with hashed password
const comparePassword = (hashedPassword, password) =>{
    // compare the password
    const data = bcrypt.compareSync(password, hashedPassword)
    return data;
}


module.exports ={
    hashPassword,
    comparePassword
}