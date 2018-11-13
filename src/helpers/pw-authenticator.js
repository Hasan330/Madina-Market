import bcrypt from 'bcrypt-nodejs';

const generatePassword = (password) => {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


const validatePassword = (password, hashedPassword) => {  
  return bcrypt.compareSync(password, hashedPassword);
};


module.exports={validatePassword}