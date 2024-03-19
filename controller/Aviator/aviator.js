const con = require("../../config/database");

exports.aviatortest = (req, res) => {
  let array = [];
  try {
    con.query("SELECT * FROM user", (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          msg: "Error in data fetching",
          error: err.message,
          er: err,
        });
      }
      // console.log(result);
      array = result;
      // console.log(array, "This is final result");

      array = array?.map((i) => {
        return { ...i, count: 0 };
      });

      console.log(
        new Date("2024-01-27T06:13:41.000Z").getFullYear(),
        new Date("2024-01-27T06:13:41.000Z").getMonth(),
        new Date().getMonth()
      );

      const new_data = updateReferralCount(array)
        ?.map((i) => {
          return {
            ...i,
            income:
              i.count === 10000
                ? 250000
                : i.count === 1500
                ? 100000
                : i.count === 1000
                ? 25000
                : i.count === 500
                ? 7500
                : i.count === 150
                ? 2000
                : i.count === 1
                ? 500
                : 0,
          };
        })
        ?.filter((j) => j.income !== 0);

      // con.query("UPDATE user SET ''")
      // new_data.forEach((value) => {
      //   con.query(
      //     `UPDATE user SET winning_wallet = winning_wallet + ${value.income} WHERE id = ${value.id}`,
      //     (err, result) => {
      //       if (err) {
      //         console.error('Error updating user:', err);
      //       } else {
      //         console.log('User updated successfully');
      //       }
      //     }
      //   );
      // });

      // new_data.forEach((value) => {
      //   con.query(
      //     `INSERT INTO leser (l01_user_id, l01_type, l01_transection_type, l01_amount) VALUES (${value.id}, 9, 'Monthly income', ${value.income})`,
      //     (err, result) => {
      //       if (err) {
      //         console.error('Error inserting data into leser:', err);
      //       } else {
      //         console.log('Data inserted into leser successfully');
      //       }
      //     }
      //   );
      // });

      console.log(new_data, "This is new data");

      if (result && result.length > 0) {
        return res.status(200).json({
          data: result,
          msg: "Data fetched successfully",
        });
      } else {
        return res.status(404).json({
          msg: "No data found",
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      msg: "Error in data fetching",
      error: e.message,
    });
  }
};

function updateReferralCount(users) {
  const countMap = {};

  function updateCount(userId) {
    if (
      creationDate.getFullYear() === currentDate.getFullYear() &&
      creationDate.getMonth() === currentDate.getMonth() - 1 &&
      user.first_recharge === 1
    ) {
      if (countMap[userId]) {
        countMap[userId]++;
      } else {
        countMap[userId] = 1;
      }
    }

    const user = users.find((u) => u.id === userId);

    if (user.referral_user_id !== null) {
      const currentDate = new Date();
      // Get the creation date of the user
      const creationDate = new Date(user.created_at);
      if (
        creationDate.getFullYear() === currentDate.getFullYear() &&
        creationDate.getMonth() === currentDate.getMonth() - 1 &&
        user.first_recharge === 1
      )
        updateCount(user.referral_user_id);
    }
  }

  users.forEach((user) => {
    // Get the current date
    const currentDate = new Date();
    // Get the creation date of the user
    const creationDate = new Date(user.created_at);
    if (
      creationDate.getFullYear() === currentDate.getFullYear() &&
      creationDate.getMonth() === currentDate.getMonth() - 1 &&
      user.first_recharge === 1
    ) {
      // Update the referral count only if the condition is met
      if (user.referral_user_id !== null) {
        updateCount(user.referral_user_id);
      }
    }
  });

  users.forEach((user) => {
    if (countMap[user.id]) {
      user.count = countMap[user.id];
    } else {
      user.count = 0;
    }
  });

  return users;
}
