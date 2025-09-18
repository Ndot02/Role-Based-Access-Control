export const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
export const getExpiry = () => Date.now() + 10 * 60 * 1000; // 10 min
