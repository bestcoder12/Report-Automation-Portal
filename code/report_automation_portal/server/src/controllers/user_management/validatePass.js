import bcrypt from 'bcrypt';

const validatePass = async (ptPassword, passHash) => {
  if (ptPassword === undefined) {
    return false;
  }
  const passMatch = await bcrypt.compare(ptPassword, passHash);
  return passMatch;
};

export default validatePass;
