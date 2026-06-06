const express = require('express');
const cors = require('cors');
const { router: authRouter } = require('./routes/auth');
const listingsRouter = require('./routes/listings');
const { query, initDb } = require('./db');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'OwnerToRenter API' });
});

// Seed mock listings if the database is empty
async function seedDatabase() {
  try {
    const userCount = await query.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count === 0) {
      console.log('Seeding demo data...');

      // Create owner user
      const ownerSalt = await bcrypt.genSalt(10);
      const ownerHash = await bcrypt.hash('password123', ownerSalt);
      const ownerResult = await query.run(
        'INSERT INTO users (name, email, phone, cnic, password, role, verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['Ali Khan', 'ali@example.com', '+92 300 1234567', '37405-1234567-1', ownerHash, 'owner', 1]
      );
      const ownerId = ownerResult.id;

      // Create another owner
      const owner2Result = await query.run(
        'INSERT INTO users (name, email, phone, cnic, password, role, verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['Zainab Bibi', 'zainab@example.com', '+92 312 9876543', '37405-7654321-2', ownerHash, 'owner', 1]
      );
      const owner2Id = owner2Result.id;

      // Create tenant user
      const tenantHash = await bcrypt.hash('password123', ownerSalt);
      const tenantResult = await query.run(
        'INSERT INTO users (name, email, phone, cnic, password, role, verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['Hamza Ahmed', 'hamza@example.com', '+92 345 5554433', '37405-9998887-3', tenantHash, 'tenant', 0]
      );
      const tenantId = tenantResult.id;

      // Create Listings with Extended smart details
      const listings = [
        {
          userId: ownerId,
          title: 'Furnished 2 Bedroom Apartment in F-11',
          description: 'A beautiful luxury apartment with all modern amenities, 24/7 security, backup generator, and dedicated parking. Walking distance to F-11 Markaz. Highly recommended for families.',
          category: 'Apartment',
          city: 'Islamabad',
          area: 'F-11',
          address: 'Silver Oaks, F-11 Markaz, Islamabad',
          rent: 75000,
          deposit: 150000,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          availability: 'Now',
          familyOnly: 1,
          bachelorAllowed: 0,
          furnished: 'Fully Furnished',
          parkingAvailable: 1,
          generatorBackup: 1,
          solarInstalled: 0,
          metroDist: '300m from F-11 Metro Station',
          schoolDist: '500m from Beaconhouse School',
          hospitalDist: '1.2km from Shifa Medical Center',
          rating: 4.8,
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
          ]
        },
        {
          userId: ownerId,
          title: '1 Kanal Beautiful House for Rent in DHA Phase 2',
          description: 'Brand new construction, 5 master bedrooms with attached baths, double kitchen, spacious lawn, and garage space for 3 cars. Prime location near commercial area.',
          category: 'House',
          city: 'Islamabad',
          area: 'DHA Phase 2',
          address: 'Sector B, DHA Phase 2, Islamabad',
          rent: 180000,
          deposit: 360000,
          videoUrl: '',
          availability: 'Next Month',
          familyOnly: 1,
          bachelorAllowed: 0,
          furnished: 'Semi-Furnished',
          parkingAvailable: 1,
          generatorBackup: 0,
          solarInstalled: 1,
          metroDist: '2.5km from DHA Metro link',
          schoolDist: '200m from Roots Millennium School',
          hospitalDist: '800m from DHA Medical Clinic',
          rating: 5.0,
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
          ]
        },
        {
          userId: owner2Id,
          title: 'Commercial Office Space in Blue Area',
          description: 'Fully furnished office space with partitions, conference room, high-speed fiber internet connection, and server room setup. Excellent view of Margalla Hills.',
          category: 'Office',
          city: 'Islamabad',
          area: 'Blue Area',
          address: 'Saudi Pak Tower, Blue Area, Islamabad',
          rent: 120000,
          deposit: 240000,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          availability: 'Now',
          familyOnly: 0,
          bachelorAllowed: 1,
          furnished: 'Fully Furnished',
          parkingAvailable: 1,
          generatorBackup: 1,
          solarInstalled: 1,
          metroDist: '100m from Stock Exchange Metro Station',
          schoolDist: '1.5km from FG College',
          hospitalDist: '600m from Kulsum International Hospital',
          rating: 4.5,
          images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
          ]
        },
        {
          userId: owner2Id,
          title: 'Bachelor Studio Apartment in Saddar',
          description: 'Ideal for students or young professionals. Safe area, separate electricity meter, 24 hours water supply, walking distance to shops.',
          category: 'Apartment',
          city: 'Rawalpindi',
          area: 'Saddar',
          address: 'Bank Road, Saddar, Rawalpindi',
          rent: 28000,
          deposit: 50000,
          videoUrl: '',
          availability: 'Now',
          familyOnly: 0,
          bachelorAllowed: 1,
          furnished: 'Unfurnished',
          parkingAvailable: 0,
          generatorBackup: 0,
          solarInstalled: 0,
          metroDist: '400m from Saddar Metro Station',
          schoolDist: '800m from Army Public School',
          hospitalDist: '500m from Cantt General Hospital',
          rating: 4.2,
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
          ]
        }
      ];

      for (const item of listings) {
        const listRes = await query.run(
          `INSERT INTO listings (
            user_id, title, description, category, city, area, address, rent, deposit, status,
            video_url, availability, family_only, bachelor_allowed, furnished,
            parking_available, generator_backup, solar_installed, metro_dist, school_dist, hospital_dist, rating
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.userId, item.title, item.description, item.category, item.city, item.area, item.address, item.rent, item.deposit,
            item.videoUrl, item.availability, item.familyOnly, item.bachelorAllowed, item.furnished,
            item.parkingAvailable, item.generatorBackup, item.solarInstalled,
            item.metroDist, item.schoolDist, item.hospitalDist, item.rating
          ]
        );

        for (const imgUrl of item.images) {
          await query.run('INSERT INTO images (listing_id, image_url) VALUES (?, ?)', [listRes.id, imgUrl]);
        }
      }

      // Seed mock Tenant Requests
      await query.run(
        `INSERT INTO tenant_requests (user_id, title, category, city, area, budget, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          tenantId, 
          'Looking for a 2 Bedroom House inside Bahria Town', 
          'House', 
          'Rawalpindi', 
          'Bahria Town Phase 8', 
          35000, 
          '+92 345 5554433'
        ]
      );

      await query.run(
        `INSERT INTO tenant_requests (user_id, title, category, city, area, budget, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          tenantId, 
          'Studio Apartment or Shared room needed in Blue Area', 
          'Apartment', 
          'Islamabad', 
          'Blue Area', 
          22000, 
          '+92 345 5554433'
        ]
      );

      console.log('Seeding completed successfully.');
    }
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
}

async function startServer() {
  try {
    await initDb();
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      await seedDatabase();
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

startServer();
