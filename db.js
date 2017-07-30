const pg = require('pg'),
      client = new pg.Client(process.env.DATABASE_URL);


client.connect();

function query(sql, params){
  return new Promise(function(resolve, reject){
    client.query(sql, params, function(err, result){
      if (err){
        return reject(err);
      }
      resolve(result);
    });
  });
}

function sync(){
  var sql = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(255) UNIQUE,
      manager BOOLEAN
    );
  `;
  return query(sql);
}

function getUser(id){
  return query('SELECT name FROM users WHERE id=$1', [id]);
}

function getUsers(onlyManagers){
  if (onlyManagers === true){
    return query('SELECT * FROM users WHERE manager=$1', ['true'])
      .then(function(result){
        return result.rows;
      });
  } else {
    return query('SELECT * FROM users')
      .then(function(result){
        return result.rows;
      });
  }

}

function createUser(user){
  if (!user.name){
    throw 'Name is required!';
  }
  return query(`INSERT INTO users (name, manager) VALUES ($1, $2)`, [user.name, user.manager || false]);

}

function updateUser(user){
  return query(`UPDATE users SET manager=$1 WHERE id=$2 RETURNING manager`, [user.manager, user.id]);
}

function deleteUser(id){
  return query(`DELETE FROM users WHERE id=$1`, [id]);
}

function seed(){
  return Promise.all(
    [createUser({
      name: 'Cookie Monster'
    }),
    createUser({
      name: 'Big Bird',
      manager: true
    }),
    createUser({
      name: 'Oscar the Grouch'
    }),
    createUser({
      name: 'Elmo',
      manager: true
    })
    ]
  );
}

module.exports = {
  sync: sync,
  getUser: getUser,
  getUsers: getUsers,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  seed: seed
};
