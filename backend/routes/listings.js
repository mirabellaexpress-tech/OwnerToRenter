const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { authenticateToken } = require('./auth');

// Get all listings with optional filters
router.get('/', async (req, res) => {
  const { 
    city, area, category, minRent, maxRent, search, 
    familyOnly, bachelorAllowed, furnished, parkingAvailable, generatorBackup, solarInstalled 
  } = req.query;
  
  let sql = `
    SELECT l.*, u.name as owner_name, u.phone as owner_phone, u.verified as owner_verified,
           (SELECT image_url FROM images WHERE listing_id = l.id LIMIT 1) as main_image
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.status = 'active'
  `;
  const params = [];

  if (city) {
    sql += ' AND l.city = ?';
    params.push(city);
  }
  if (area) {
    sql += ' AND l.area LIKE ?';
    params.push(`%${area}%`);
  }
  if (category && category !== 'Other') {
    sql += ' AND l.category = ?';
    params.push(category);
  }
  if (minRent) {
    sql += ' AND l.rent >= ?';
    params.push(parseFloat(minRent));
  }
  if (maxRent) {
    sql += ' AND l.rent <= ?';
    params.push(parseFloat(maxRent));
  }
  if (search) {
    sql += ' AND (l.title LIKE ? OR l.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Smart Filters
  if (familyOnly === 'true') {
    sql += ' AND l.family_only = 1';
  }
  if (bachelorAllowed === 'true') {
    sql += ' AND l.bachelor_allowed = 1';
  }
  if (furnished && furnished !== 'Any') {
    sql += ' AND l.furnished = ?';
    params.push(furnished);
  }
  if (parkingAvailable === 'true') {
    sql += ' AND l.parking_available = 1';
  }
  if (generatorBackup === 'true') {
    sql += ' AND l.generator_backup = 1';
  }
  if (solarInstalled === 'true') {
    sql += ' AND l.solar_installed = 1';
  }

  // Order by id descending
  sql += ' ORDER BY l.id DESC';

  try {
    const listings = await query.all(sql, params);
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve listings' });
  }
});

// Tenant Requests Board Endpoints
router.get('/requests/all', async (req, res) => {
  try {
    const requests = await query.all(`
      SELECT tr.*, u.name as tenant_name 
      FROM tenant_requests tr
      JOIN users u ON tr.user_id = u.id
      ORDER BY tr.id DESC
    `);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve tenant requests' });
  }
});

router.post('/requests', authenticateToken, async (req, res) => {
  const { title, category, city, area, budget, phone } = req.body;

  if (!title || !category || !city || !area || !budget) {
    return res.status(400).json({ error: 'Please enter all required fields for tenant request' });
  }

  try {
    const result = await query.run(
      `INSERT INTO tenant_requests (user_id, title, category, city, area, budget, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, category, city, area, parseFloat(budget), phone || req.user.phone]
    );
    res.status(201).json({ message: 'Request posted successfully', requestId: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create tenant request' });
  }
});

// Get single listing details with all its images
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await query.get(`
      SELECT l.*, u.name as owner_name, u.phone as owner_phone, u.verified as owner_verified
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `, [id]);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const images = await query.all('SELECT image_url FROM images WHERE listing_id = ?', [id]);
    listing.images = images.map(img => img.image_url);

    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving listing details' });
  }
});

// Create new listing (Owners only)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Only owners can add listings' });
  }

  const { 
    title, description, category, city, area, address, rent, deposit, images,
    video_url, availability, family_only, bachelor_allowed, furnished,
    parking_available, generator_backup, solar_installed, metro_dist, school_dist, hospital_dist
  } = req.body;

  if (!title || !category || !city || !area || !address || !rent || !deposit) {
    return res.status(400).json({ error: 'Please enter all required listing fields' });
  }

  try {
    const result = await query.run(
      `INSERT INTO listings (
        user_id, title, description, category, city, area, address, rent, deposit, status,
        video_url, availability, family_only, bachelor_allowed, furnished,
        parking_available, generator_backup, solar_installed, metro_dist, school_dist, hospital_dist
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, title, description || '', category, city, area, address, rent, deposit,
        video_url || null, availability || 'Now', family_only ? 1 : 0, bachelor_allowed ? 1 : 0, furnished || 'Unfurnished',
        parking_available ? 1 : 0, generator_backup ? 1 : 0, solar_installed ? 1 : 0,
        metro_dist || '500m', school_dist || '300m', hospital_dist || '1km'
      ]
    );

    const listingId = result.id;

    if (images && Array.isArray(images)) {
      for (const url of images) {
        if (url) {
          await query.run('INSERT INTO images (listing_id, image_url) VALUES (?, ?)', [listingId, url]);
        }
      }
    }

    res.status(201).json({ message: 'Listing created successfully', listingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Delete listing (Owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await query.get('SELECT * FROM listings WHERE id = ?', [id]);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    if (listing.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this listing' });
    }

    await query.run('DELETE FROM listings WHERE id = ?', [id]);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// Owner's listings
router.get('/my/listings', authenticateToken, async (req, res) => {
  try {
    const listings = await query.all(`
      SELECT l.*, (SELECT image_url FROM images WHERE listing_id = l.id LIMIT 1) as main_image
      FROM listings l
      WHERE l.user_id = ?
      ORDER BY l.id DESC
    `, [req.user.id]);
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve owner listings' });
  }
});

// Add to Favorites (Tenant only)
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query.run('INSERT OR IGNORE INTO favorites (user_id, listing_id) VALUES (?, ?)', [req.user.id, id]);
    res.json({ message: 'Listing saved to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save listing' });
  }
});

// Remove from Favorites (Tenant only)
router.delete('/:id/favorite', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query.run('DELETE FROM favorites WHERE user_id = ? AND listing_id = ?', [req.user.id, id]);
    res.json({ message: 'Listing removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove listing' });
  }
});

// Tenant's Favorite listings
router.get('/my/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await query.all(`
      SELECT l.*, u.name as owner_name, u.phone as owner_phone, u.verified as owner_verified,
             (SELECT image_url FROM images WHERE listing_id = l.id LIMIT 1) as main_image
      FROM favorites f
      JOIN listings l ON f.listing_id = l.id
      JOIN users u ON l.user_id = u.id
      WHERE f.user_id = ?
      ORDER BY f.id DESC
    `, [req.user.id]);
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve favorites' });
  }
});

module.exports = router;
