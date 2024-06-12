export default {
  secret: process.env.JWT_SECRET || 'secretKey',
  signOptions: {
    expiresIn: '1h',
  },
};
