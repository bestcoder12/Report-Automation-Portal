import bcrypt from 'bcrypt';

const validatePass = async (ptPassword, passHash) => {
  const passMatch = await bcrypt.compare(ptPassword, passHash);
  return passMatch;
};

export default validatePass;
