const Sequelize = require('sequelize');

module.exports = sequelize => sequelize.define('user', {
  email: { type: Sequelize.STRING },
  uid: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING }
}, {
  underscored: true
});
