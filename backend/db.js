const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT NOT NULL,
          cnic TEXT,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('owner', 'tenant')),
          verified INTEGER DEFAULT 0
        )
      `);

      // Create Listings table with smart filters, insights and video urls
      db.run(`
        CREATE TABLE IF NOT EXISTS listings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          city TEXT NOT NULL,
          area TEXT NOT NULL,
          address TEXT NOT NULL,
          rent REAL NOT NULL,
          deposit REAL NOT NULL,
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
          video_url TEXT,
          availability TEXT DEFAULT 'Now',
          family_only INTEGER DEFAULT 1,
          bachelor_allowed INTEGER DEFAULT 0,
          furnished TEXT DEFAULT 'Unfurnished',
          parking_available INTEGER DEFAULT 1,
          generator_backup INTEGER DEFAULT 0,
          solar_installed INTEGER DEFAULT 0,
          metro_dist TEXT,
          school_dist TEXT,
          hospital_dist TEXT,
          rating REAL DEFAULT 5.0,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Create Tenant Requests Table
      db.run(`
        CREATE TABLE IF NOT EXISTS tenant_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          city TEXT NOT NULL,
          area TEXT NOT NULL,
          budget REAL NOT NULL,
          phone TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Create Images table
      db.run(`
        CREATE TABLE IF NOT EXISTS images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          listing_id INTEGER NOT NULL,
          image_url TEXT NOT NULL,
          FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
        )
      `);

      // Create Favorites table
      db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          listing_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
          UNIQUE(user_id, listing_id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database tables initialized with smart filters and tenant requests.');
          resolve();
        }
      });
    });
  });
}

// Helper methods to run queries with promises
const query = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = {
  db,
  query,
  initDb
};
