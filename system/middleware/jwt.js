const jwt = require('jsonwebtoken');

const generateTokens = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: 3600 }, 
            (err, token) => {
                if (err) reject(err);

                jwt.sign(
                    payload,
                    process.env.REFRESH_SECRET_KEY,
                    { expiresIn: process.env.EXPIRE_IN },
                    (err, refreshToken) => {
                        if (err) reject(err);
                        resolve({ token, refreshToken });
                    }
                );
            }
        );
    });
};

const createAccessToken = async (user) => {
    
    const payload = {
        user: {
          id: user.id,
          role: user.role,  
          name: user.name,
          email: user.email,
        },
      };
    console.log(payload, "payload");
    
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
};

const resetToken = async(payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: process.env.EXPIRE_IN },
            (err, refreshToken) => {
                if (err) reject(err);
                resolve(refreshToken);
            }
        );
    });
};



module.exports = { generateTokens,createAccessToken };
