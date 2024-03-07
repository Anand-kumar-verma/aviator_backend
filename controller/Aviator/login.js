const con = require('../../config/database');

exports.loginFun = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    con.query(
      `SELECT * FROM user WHERE email='${email}' AND password='${password}'`,
      (err, result) => {
        console.log(result, "result");
        if (result.length > 0) {
          return res.status(200).json({
            data: result,
            message: "Data get successfully",
            success:"200"
          });
        } else {
          return res.status(400).json({
            message: "Error in data fetching",
          });
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Error in data fetching",
    });
  }
};

