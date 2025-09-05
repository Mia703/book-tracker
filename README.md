# 📚 Book Tracker  

## 📖 Description  

Book Tracker is a web application that helps users organize and track their reading progress. Users can search books via the Google Books API or add custom entries, then categorize them into Reading, Wish List, Finished, or Did Not Finish. The app also allows saving personal notes, progress updates, and ratings for each book.  

## ✨ Features  

- Search books using the Google Books API  
- Add custom books manually when no ISBN is available  
- Organize books into categories: Reading, Wish List, Finished, DNF  
- Save progress, personal reflections, and ratings  
- Responsive UI built with ShadCN and TailwindCSS  
- Persistent storage with Xata.io database  

## 🛠 Tech Stack  

- **Framework:** Next.js (React + TypeScript)  
- **Styling:** TailwindCSS, ShadCN components  
- **Database:** Xata.io  
- **Forms:** Formik (submission), Yup (validation)  
- **Icons:** Lucide Icons  
- **External API:** Google Books API  
- **Deployment:** Vercel  

## ⚙️ Installation & Usage  

1. Clone the repository:  

   ```bash
   git clone https://github.com/Mia703/book-tracker.git
   cd book-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Google Books API key:

   ```bash
   NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=your_api_key_here
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser:

## License

Book Tracker © 2025 by Amya Moore is licensed under CC BY-NC 4.0. To view a copy of this liences, visit ...