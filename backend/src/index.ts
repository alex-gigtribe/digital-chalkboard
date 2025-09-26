// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());

// // Mock API endpoint for bin data
// app.get('/api/bins', (req, res) => {
//   res.json({
//     status: 'success',
//     data: {
//       totalBins: 903,
//       varieties: ['Granny Smith', 'Golden Delicious', 'Pink Lady'],
//       producers: ['Welgelegen', 'Boplaas']
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Backend running on port ${PORT}`);
// });