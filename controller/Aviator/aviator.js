const con = require('../../config/database');

exports.aviatortest = (req, res) => {
  try {
    con.query('SELECT * FROM user', (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          msg: 'Error in data fetching',
          error: err.message,
          er:err
        });
      }

      console.log(result, "result");

      if (result && result.length > 0) {
        return res.status(200).json({
          data: result,
          msg: 'Data fetched successfully',
        });
      } else {
        return res.status(404).json({
          msg: 'No data found',
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      msg: 'Error in data fetching',
      error: e.message,
    });
  }
};
