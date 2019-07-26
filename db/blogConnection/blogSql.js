var BlogSQL = {
  insert: 'INSERT INTO blog (user_name,user_password) VALUES(?,?)', // 插入数据
  drop: 'DROP TABLE user', // 删除表中所有的数据
  queryAll: 'SELECT * FROM user', // 查找表中所有数据
  getUserById: 'SELECT * FROM user WHERE uid =?', // 查找符合条件的数据
  selective:'select * from article limit (?) offset (?) '
};
module.exports = BlogSQL;